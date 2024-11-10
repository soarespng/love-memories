import { DeleteDate } from "@/controllers/dateController";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        await DeleteDate(req, res);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}