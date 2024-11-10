import { updateCategories } from "@/controllers/coupleController";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await updateCategories(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}