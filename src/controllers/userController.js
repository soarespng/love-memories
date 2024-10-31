const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const syncCode = crypto.randomBytes(3).toString('hex');

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name: username,
        email,
        password: hashedPassword,
        sync_code: syncCode,
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
    process.env.NEXT_PUBLIC_JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, user: { id: users.id, email: users.email } });
};

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

// Função para vincular dois usuários
exports.linkUsers = async (req, res) => {
  const { userCurrentId, syncCode } = req.body;

  try {
    const { data: user, error: errorUser } = await supabase
      .from('users')
      .select('id')
      .eq('sync_code', syncCode)
      .single();

    if (errorUser || !user) return res.status(400).json({ error: 'User not found' });

    const { data, error } = await supabase
      .from('couples')
      .insert([{ user1_id: userCurrentId, user2_id: user.id }]);

    if (error) {
      return res.status(400).json({ error: 'Failed to link users' });
    }

    res.status(200).json({ message: 'Users linked successfully', couple: data });
  } catch (error) {
    console.error('Error linking users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};