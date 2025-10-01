import { Router } from 'express';
const r = Router();
const memory = [];
r.get('/', (_req,res)=>res.json(memory));
r.get('/:slug', (req,res)=>{
  const item = memory.find(p=>p.slug===req.params.slug);
  if(!item) return res.status(404).json({message:'Not found'});
  res.json(item);
});
r.post('/', (req,res)=>{
  const doc = { ...req.body, _id:String(Date.now()), createdAt:new Date(), updatedAt:new Date() };
  memory.push(doc);
  res.status(201).json(doc);
});
r.patch('/:id', (req,res)=>{
  const i = memory.findIndex(p=>p._id===req.params.id);
  if(i===-1) return res.status(404).json({message:'Not found'});
  memory[i] = { ...memory[i], ...req.body, updatedAt:new Date() };
  res.json(memory[i]);
});
r.delete('/:id', (req,res)=>{
  const i = memory.findIndex(p=>p._id===req.params.id);
  if(i===-1) return res.status(404).json({message:'Not found'});
  memory.splice(i,1);
  res.status(204).end();
});
export default r;
