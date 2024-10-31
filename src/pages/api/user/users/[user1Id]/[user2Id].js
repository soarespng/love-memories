import userController from '@/controllers';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await userController.getUsersData(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
