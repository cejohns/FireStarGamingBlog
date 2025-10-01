import { Router } from "express";
import { getGamingNews } from "../services/newsService.js";
const router = Router();
router.get("/", async (_req,res)=>{
  try {
    const items = await getGamingNews();
    res.json({ count: items.length, items });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
export default router;
