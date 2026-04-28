/**
 * Vite Plugin — Episode Editor API
 *
 * Dev-only middleware that exposes:
 *   GET /__episode?project=X&id=EP037   → { raw: string }
 *   PUT /__episode                       → body { project, episodeId, originalRaw, newRaw }
 *                                          → 200 { raw } | 404 | 409 { current } | 4xx
 *
 * Storage: projects/{project}/episode/{episodeId}.md
 *
 * Safety: project whitelist + episodeId regex (path-traversal hardened) +
 * originalRaw equality check (concurrent-edit guard).
 */

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_PROJECTS = new Set([
  'dclass-hero',
  'canned-master',
  'magitech-fire',
  'asteropos',
]);
const EPISODE_ID_RE = /^EP\d{3}$/;

function episodePath(root: string, project: string, episodeId: string): string {
  return path.resolve(root, `projects/${project}/episode/${episodeId}.md`);
}

function badRequest(res: import('http').ServerResponse, msg: string) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: msg }));
}

function readBody(req: import('http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export default function episodePlugin(): Plugin {
  let root = '';

  return {
    name: 'vite-plugin-episode',
    apply: 'serve',

    configResolved(config) {
      root = config.root;
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/__episode')) return next();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        const [urlPath, query = ''] = req.url.split('?');
        if (urlPath !== '/__episode') return next();

        // GET /__episode?project=X&id=EP037
        if (req.method === 'GET') {
          const params = new URLSearchParams(query);
          const project = params.get('project') ?? '';
          const id = params.get('id') ?? '';

          if (!ALLOWED_PROJECTS.has(project)) return badRequest(res, 'Invalid project');
          if (!EPISODE_ID_RE.test(id)) return badRequest(res, 'Invalid episode id');

          const filePath = episodePath(root, project, id);
          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Episode not found' }));
          }

          const raw = fs.readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ raw }));
        }

        // PUT /__episode
        if (req.method === 'PUT') {
          (async () => {
            try {
              const body = await readBody(req);
              const payload = JSON.parse(body) as {
                project?: string;
                episodeId?: string;
                originalRaw?: string;
                newRaw?: string;
              };
              const { project, episodeId, originalRaw, newRaw } = payload;

              if (!project || !ALLOWED_PROJECTS.has(project)) {
                return badRequest(res, 'Invalid project');
              }
              if (!episodeId || !EPISODE_ID_RE.test(episodeId)) {
                return badRequest(res, 'Invalid episode id');
              }
              if (typeof originalRaw !== 'string' || typeof newRaw !== 'string') {
                return badRequest(res, 'originalRaw and newRaw must be strings');
              }
              if (newRaw.trim().length === 0) {
                return badRequest(res, 'newRaw is empty');
              }

              const filePath = episodePath(root, project, episodeId);
              if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Episode not found' }));
              }

              const current = fs.readFileSync(filePath, 'utf-8');
              if (current !== originalRaw) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                return res.end(
                  JSON.stringify({
                    error: 'Episode changed externally',
                    current,
                  })
                );
              }

              fs.writeFileSync(filePath, newRaw, 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ raw: newRaw }));
            } catch {
              return badRequest(res, 'Invalid JSON');
            }
          })();
          return;
        }

        next();
      });
    },
  };
}
