/**
 * Vite Plugin — Inline Feedback API (멀티 프로젝트)
 *
 * Dev-only middleware that exposes:
 *   GET   /__feedback?project=X         → feedback list for project
 *   POST  /__feedback?project=X         → add feedback to project
 *   PATCH /__feedback/:id?project=X     → update status (project로 파일 라우팅)
 *
 * 화이트리스트·경로는 src/projects/registry.ts 단일 소스에서 가져온다.
 * Storage: <projectPaths(project).feedbackFile> (= projects/{id}/revision/inline-feedback.json)
 *
 * 호환성:
 *   - project 쿼리 누락 시 dclass-hero로 fallback (기존 클라이언트와 호환).
 *   - feedbackEnabled 플래그가 false인 프로젝트는 모든 메서드 400 거부.
 */

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import {
  ACTIVE_PROJECT_IDS,
  PROJECTS,
  projectPaths,
  getProjectMeta,
} from './src/projects/registry';

const DEFAULT_PROJECT_ID = 'dclass-hero';

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

function ensureFile(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');
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

function resolveProject(query: URLSearchParams): { id: string; error?: string } {
  const id = query.get('project') ?? DEFAULT_PROJECT_ID;
  if (!ACTIVE_PROJECT_IDS.has(id)) return { id, error: 'Invalid project' };
  const meta = getProjectMeta(id);
  if (!meta?.feedbackEnabled) {
    return { id, error: `Project '${id}' does not have feedback enabled` };
  }
  return { id };
}

export default function feedbackPlugin(): Plugin {
  let root = '';

  return {
    name: 'vite-plugin-feedback',
    apply: 'serve',

    configResolved(config) {
      root = config.root;
      // feedbackEnabled 프로젝트의 파일을 사전 생성
      for (const p of PROJECTS) {
        if (p.feedbackEnabled) {
          ensureFile(path.resolve(root, projectPaths(p.id).feedbackFile));
        }
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

        const [urlPath, queryStr = ''] = req.url.split('?');
        const params = new URLSearchParams(queryStr);
        const { id: projectId, error: projectError } = resolveProject(params);

        if (projectError) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: projectError }));
        }

        const filePath = path.resolve(root, projectPaths(projectId).feedbackFile);
        ensureFile(filePath);

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
