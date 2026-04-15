/**
 * Vite Plugin — Inline Feedback API (multi-project)
 *
 * Dev-only middleware that exposes:
 *   GET  /__feedback[?project=storyboard]    → feedback list
 *   POST /__feedback[?project=storyboard]    → add feedback
 *   PATCH /__feedback/:id[?project=storyboard] → update status
 *
 * Storage:
 *   default (novel):     docs/story/inline-feedback.json
 *   project=storyboard:  docs/storyboard-feedback.json
 */

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export interface InlineFeedback {
  id: string;
  timestamp: string;
  // Novel fields
  chapterId?: string;
  chapterNum?: number;
  chapterTitle?: string;
  // Storyboard fields
  episodeId?: string;
  episodeNum?: number;
  episodeTitle?: string;
  cutTimeRange?: string;
  // Common
  quotedText: string;
  comment: string;
  status: 'pending' | 'applied' | 'rejected' | 'wontfix';
}

const FEEDBACK_FILES: Record<string, string> = {
  novel: 'docs/story/inline-feedback.json',
  storyboard: 'docs/storyboard-feedback.json',
};

function getProject(url: string): string {
  const u = new URL(url, 'http://localhost');
  return u.searchParams.get('project') || 'novel';
}

function getFeedbackFile(root: string, project: string): string {
  const rel = FEEDBACK_FILES[project] || FEEDBACK_FILES.novel;
  return path.resolve(root, rel);
}

function ensureFile(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }
}

function readFeedbacks(filePath: string): InlineFeedback[] {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeFeedbacks(filePath: string, data: InlineFeedback[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export default function feedbackPlugin(): Plugin {
  let root = '';

  return {
    name: 'vite-plugin-feedback',
    apply: 'serve',

    configResolved(config) {
      root = config.root;
      // Ensure both files exist
      for (const rel of Object.values(FEEDBACK_FILES)) {
        ensureFile(path.resolve(root, rel));
      }
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/__feedback')) return next();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        const project = getProject(req.url);
        const filePath = getFeedbackFile(root, project);
        ensureFile(filePath);

        // Strip query string and extract path
        const urlPath = req.url.split('?')[0];

        // GET /__feedback
        if (req.method === 'GET' && urlPath === '/__feedback') {
          const data = readFeedbacks(filePath);
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(data));
        }

        // POST /__feedback
        if (req.method === 'POST' && urlPath === '/__feedback') {
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const feedbacks = readFeedbacks(filePath);
              const entry: InlineFeedback = {
                id: `fb-${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 'pending',
                ...payload,
              };
              feedbacks.push(entry);
              writeFeedbacks(filePath, feedbacks);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(entry));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // PATCH /__feedback/:id
        if (req.method === 'PATCH' && urlPath.startsWith('/__feedback/')) {
          const id = urlPath.slice('/__feedback/'.length);
          let body = '';
          req.on('data', (chunk) => (body += chunk));
          req.on('end', () => {
            try {
              const patch = JSON.parse(body) as Partial<InlineFeedback>;
              const feedbacks = readFeedbacks(filePath);
              const idx = feedbacks.findIndex((f) => f.id === id);
              if (idx === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Not found' }));
              }
              feedbacks[idx] = { ...feedbacks[idx], ...patch };
              writeFeedbacks(filePath, feedbacks);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(feedbacks[idx]));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
