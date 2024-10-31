const express = require('express');
const next = require('next');
const dotenv = require('dotenv');
const cors = require('cors');
const userController = require('./src/controllers/userController');
const coupleController = require('./src/controllers/coupleController');

dotenv.config();

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  server.use(cors({ origin: 'http://localhost:3001' }));

  // Rotas de API

  //user
  server.post('/api/user/register', userController.registerUser);
  server.post('/api/user/login', userController.loginUser);
  server.get('/api/user/:userId', userController.getUserData);
  server.get('/api/user/users/:user1Id/:user2Id', userController.getUsersData);

  //couple
  server.get('/api/couple/checkUserCouple/:userId', coupleController.existUserInCouple);
  server.get('/api/couple/:userId', coupleController.getCoupleData);
  server.get('/api/couple/tasks/:coupleId', coupleController.getAllTasks);
  server.get('/api/couple/tasks/completed/:coupleId', coupleController.getCompletedTasksCount);

  // Todas as outras rotas tratadas pelo Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
