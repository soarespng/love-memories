import multer from 'multer';
import { uploadImage } from "@/controllers/dateController";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('file')(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
      }
      await uploadImage(req, res);
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
