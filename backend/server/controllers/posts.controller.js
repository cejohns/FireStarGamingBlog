import Post from '../models/Post.js';

export const list = async (_req, res, next) => {
  try {
    const items = await Post.find({ status: 'published' }).sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (e) { next(e); }
};

export const getBySlug = async (req, res, next) => {
  try {
    const item = await Post.findOne({ slug: req.params.slug, status: 'published' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const doc = await Post.create(req.body);
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const doc = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const ok = await Post.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.status(204).end();
  } catch (e) { next(e); }
};
