import { getCollectionsCouple } from "@/controllers/collectionController"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getCollectionsCouple(req, res);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}