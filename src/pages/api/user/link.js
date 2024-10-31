import { linkUsers } from "@/controllers/userController";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await linkUsers(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
