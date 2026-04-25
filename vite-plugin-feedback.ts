/**
 * Vite Plugin — Inline Feedback API
 *
 * Dev-only middleware that exposes:
 *   GET   /__feedback         → feedback list
 *   POST  /__feedback         → add feedback
 *   PATCH /__feedback/:id     → update status
 *
 * Storage: docs/story/inline-feedback.json
 */

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export interface InlineFeedback {
  id: string;
  timestamp: string;
  chapterId: string;
  chapterNum: number;
  chapterTitle: string;
  quotedText: string;
  comment: string;
  status: 'pending' | 'applied' | 'rejected' | 'wontfix';
}

const FEEDBACK_FILE = 'docs/story/inline-feedback.json';

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
      ensureFile(path.resolve(root, FEEDBACK_FILE));
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

        const filePath = path.resolve(root, FEEDBACK_FILE);
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
