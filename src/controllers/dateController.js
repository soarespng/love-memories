const supabase = require('../config/supabase');

exports.createNewDate = async (req, res) => {
    const { NewDate } = req.params;
  
    try {
      const { data: date, error: dateError } = await supabase
        .from('dates')
        .insert(NewDate);
  
      if (dateError) {
        return res.status(400).json({ error: 'Erro ao inserir novo date' });
      }
  
      res.status(200).json({ date });
    } catch (error) {
      console.error('Erro ao inserir date:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };