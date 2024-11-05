const supabase = require('../config/supabase');

exports.createNewDate = async (req, res) => {
  const { title, collectionId } = req.body;

  try {
    const { data: date, error: dateError } = await supabase
      .from('dates')
      .insert([{ title: title, collection_id: collectionId, date_finished: false }]);

    if (dateError) {
      return res.status(400).json({ error: 'Erro ao inserir novo date' });
    }

    res.status(200).json({ message: 'Date cadastrado com sucesso', date: date });
  } catch (error) {
    console.error('Erro ao inserir date:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.finishDate = async (req, res) => {
  const { date_id, description, rating, date_img } = req.body;

  try {
    const { data: date, error: dateError } = await supabase
      .from('dates')
      .update([{ description: description, rating: rating, date_img: date_img, date_finished: true, modify_at: new Date(new Date().getTime() - (3 * 60 * 60 * 1000)).toISOString() }])
      .eq('id', date_id);

    if (dateError) {
      return res.status(400).json({ error: 'Erro ao atualizar date' });
    }

    res.status(200).json({ message: 'Date atualizado com sucesso', date: date });
  } catch {
    console.error('Erro ao atualizar date:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.uploadImage = async (req, res) => {
  const { task_id, collection_id } = req.body;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ message: "Arquivo não enviado" });
  }

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('dates_images')
      .upload(`${collection_id}/${task_id}`, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = await supabase.storage
      .from('dates_images')
      .getPublicUrl(`${collection_id}/${task_id}`);
    
    res.status(200).json({ message: "Upload concluído", public_url: publicUrlData.publicUrl });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};
