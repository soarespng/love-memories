const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        username,
        email,
        password: hashedPassword,
        modify_at: new Date()
      }
    ]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'User registered successfully', user: data });
};

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

exports.getUserData = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, username')
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
