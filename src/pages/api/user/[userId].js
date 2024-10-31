import { getUserData } from "@/controllers/userController";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await getUserData(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
