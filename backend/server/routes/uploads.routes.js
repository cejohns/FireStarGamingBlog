// backend/server/routes/uploads.routes.js
import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middlewares/auth.js';

const uploadDir = path.resolve('backend/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname) || '';
    cb(null, `${ts}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage });

const r = Router();

// serve static uploads
r.use('/files', (req, res, next) => {
  const filePath = path.join(uploadDir, req.path);
  if (!filePath.startsWith(uploadDir)) return res.status(400).end(); // basic path escape guard
  next();
});
r.use('/files', express.static(uploadDir));

// admin-only upload
r.post('/', requireAuth(['admin']), upload.single('image'), (req, res) => {
  const file = req.file;
  const publicUrl = `/api/uploads/files/${file.filename}`; // served by this router
  res.status(201).json({ url: publicUrl, filename: file.filename, size: file.size });
});

export default r;
