import userController from "@/controllers";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await userController.loginUser(req, res);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}