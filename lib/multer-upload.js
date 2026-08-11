import fs from "fs";
import path from "path";
import multer from "multer";
import { Readable } from "stream";

const uploadDir = path.join(process.cwd(), "public", "uploads");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname
    )}`;
    cb(null, safeName);
  }
});

export const upload = multer({ storage });

export function toNodeRequest(request) {
  const nodeReq = Readable.fromWeb(request.body);
  nodeReq.headers = Object.fromEntries(request.headers.entries());
  nodeReq.method = request.method;
  nodeReq.url = new URL(request.url).pathname;
  return nodeReq;
}

export function runMiddleware(req, res, middleware) {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}
