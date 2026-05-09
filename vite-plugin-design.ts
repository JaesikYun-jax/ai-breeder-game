/**
 * Vite Plugin — Design Document Editor API
 *
 * Dev-only middleware that exposes:
 *   GET /__design?project=X&key=characters       → { raw: string }
 *   GET /__design?project=X&key=blue/draft_azelia → { raw: string }
 *   PUT /__design                                  → body { project, docKey, originalRaw, newRaw }
 *                                                    → 200 { raw } | 404 | 409 { current } | 4xx
 *
 * Storage: projects/{project}/design/{docKey}.md
 *
 * Safety: project whitelist + docKey regex (path-traversal hardened — no '..',
 * no leading slash, only [a-z0-9_-] segments separated by /) + originalRaw
 * equality check (concurrent-edit guard).
 */

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_PROJECTS = new Set([
  'dclass-hero',
  'canned-master',
  'asteropos',
  'skill-compiler',
]);

// Each path segment: starts with [a-z0-9], then [a-z0-9_-] only.
// Multiple segments allowed via '/'. No leading/trailing slash. No '..'.
const DOC_KEY_RE = /^[a-z0-9][a-z0-9_-]*(?:\/[a-z0-9][a-z0-9_-]*)*$/;

function designPath(root: string, project: string, docKey: string): string {
  return path.resolve(root, `projects/${project}/design/${docKey}.md`);
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

export default function designPlugin(): Plugin {
  let root = '';

  return {
    name: 'vite-plugin-design',
    apply: 'serve',

    configResolved(config) {
      root = config.root;
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/__design')) return next();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        const [urlPath, query = ''] = req.url.split('?');
        if (urlPath !== '/__design') return next();

        // GET /__design?project=X&key=Y
        if (req.method === 'GET') {
          const params = new URLSearchParams(query);
          const project = params.get('project') ?? '';
          const key = params.get('key') ?? '';

          if (!ALLOWED_PROJECTS.has(project)) return badRequest(res, 'Invalid project');
          if (!DOC_KEY_RE.test(key)) return badRequest(res, 'Invalid doc key');

          const filePath = designPath(root, project, key);
          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Design doc not found' }));
          }

          const raw = fs.readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ raw }));
        }

        // PUT /__design
        if (req.method === 'PUT') {
          (async () => {
            try {
              const body = await readBody(req);
              const payload = JSON.parse(body) as {
                project?: string;
                docKey?: string;
                originalRaw?: string;
                newRaw?: string;
              };
              const { project, docKey, originalRaw, newRaw } = payload;

              if (!project || !ALLOWED_PROJECTS.has(project)) {
                return badRequest(res, 'Invalid project');
              }
              if (!docKey || !DOC_KEY_RE.test(docKey)) {
                return badRequest(res, 'Invalid doc key');
              }
              if (typeof originalRaw !== 'string' || typeof newRaw !== 'string') {
                return badRequest(res, 'originalRaw and newRaw must be strings');
              }
              if (newRaw.trim().length === 0) {
                return badRequest(res, 'newRaw is empty');
              }

              const filePath = designPath(root, project, docKey);
              if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Design doc not found' }));
              }

              const current = fs.readFileSync(filePath, 'utf-8');
              if (current !== originalRaw) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                return res.end(
                  JSON.stringify({
                    error: 'Design doc changed externally',
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
