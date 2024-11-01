const supabase = require('../config/supabase');

exports.createNewDate = async (req, res) => {
    const { title, collectionId } = req.body;

    console.log(title);
    console.log(collectionId);
  
    try {
      const { data: date, error: dateError } = await supabase
        .from('dates')
        .insert([{title: title, collection_id: collectionId}]);
  
      if (dateError) {
        return res.status(400).json({ error: 'Erro ao inserir novo date' });
      }
      
      res.status(200).json({ message: 'Date register successfully', date: date });
    } catch (error) {
      console.error('Erro ao inserir date:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };