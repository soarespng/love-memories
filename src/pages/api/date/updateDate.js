import { updateDate } from "@/controllers/dateController";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await updateDate(req, res);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}