const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// Função para criptografar o código de sincronização
function encryptSyncCode(syncCode, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(syncCode);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Função para registrar o usuário
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Geração e criptografia do código de sincronização
  const syncCode = crypto.randomBytes(3).toString('hex');
  const secretKey = process.env.AES_SECRET;
  const encryptedSyncCode = encryptSyncCode(syncCode, secretKey);

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name: username,
        email,
        password: hashedPassword,
        sync_code: encryptedSyncCode,
        modify_at: new Date()
      }
    ]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'User registered successfully', user: data });
};

// Função para login do usuário
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !users) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, users.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: users.id, email: users.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, user: { id: users.id, email: users.email } });
};

// Função para obter dados do usuário por ID
exports.getUserData = async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, sync_code')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(400).json({ error: 'Erro ao buscar dados do usuário' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Função para obter dados de dois usuários por IDs
exports.getUsersData = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', [user1Id, user2Id]);

    if (userError) {
      return res.status(400).json({ error: 'Erro ao buscar dados dos usuários' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Erro ao buscar dados dos usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
