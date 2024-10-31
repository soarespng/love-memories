import { getAllTasks } from "@/controllers/coupleController";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getAllTasks(req, res);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}