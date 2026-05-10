/**
 * Vite Plugin — Design Document Editor API
 *
 * Dev-only middleware that exposes:
 *   GET /__design?project=X&key=characters       → { raw: string }
 *   GET /__design?project=X&key=blue/draft_azelia → { raw: string }
 *   PUT /__design                                  → body { project, docKey, originalRaw, newRaw }
 *                                                    → 200 { raw } | 404 | 409 { current } | 4xx
 *
 * 화이트리스트·경로는 src/projects/registry.ts 단일 소스에서 가져온다.
 * Storage: <projectPaths(project).designDir>/{docKey}.md
 *
 * Safety: ACTIVE_PROJECT_IDS 화이트리스트 + docKey regex (path-traversal hardened) +
 * originalRaw equality check (concurrent-edit guard).
 *
 * docKey regex 주의: 한글 파일명(예: '스킬컴파일러_캐릭터시트')도 허용해야 함 →
 * Unicode letter 허용. 다만 슬래시·점·역슬래시·공백 등은 모두 차단.
 */

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { ACTIVE_PROJECT_IDS, projectPaths } from './src/projects/registry';

// 각 세그먼트: 영문/숫자/한글 + 언더스코어/하이픈만 허용. 점·공백·역슬래시·'..' 차단.
// 슬래시로 다중 세그먼트 가능. 선두/말미 슬래시 X. 첫 글자는 영문/숫자/한글만.
const DOC_KEY_RE = /^[a-z0-9가-힣][a-z0-9_\-가-힣]*(?:\/[a-z0-9가-힣][a-z0-9_\-가-힣]*)*$/i;

function designPath(root: string, project: string, docKey: string): string {
  return path.resolve(root, projectPaths(project).designDir, `${docKey}.md`);
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

          if (!ACTIVE_PROJECT_IDS.has(project)) return badRequest(res, 'Invalid project');
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

              if (!project || !ACTIVE_PROJECT_IDS.has(project)) {
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
