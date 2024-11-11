const supabase = require('../config/supabase');

exports.createNewDate = async (req, res) => {
  const { coupleId, destiny, event, calendar, category } = req.body;
  const calendarValue = calendar ? calendar : null;

  try {
    const { data: date, error: dateError } = await supabase
      .from('dates')
      .insert([{ couple_id: coupleId, destiny: destiny, date_event: event, category: category, calendar: calendarValue, date_finished: false }]);

    if (dateError) {
      return res.status(400).json({ error: 'Erro ao inserir novo date' });
    }

    res.status(200).json({ message: 'Date cadastrado com sucesso', date: date });
  } catch (error) {
    console.error('Erro ao inserir date:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.updateDate = async (req, res) => {
  const { id, destiny, dateEvent, calendar } = req.body;

  try {
    const { data, error } = await supabase
      .from('dates')
      .update([{ destiny: destiny, date_event: dateEvent, calendar: calendar }])
      .eq('id', id);

    if (error) console.error(error);

      res.status(200).json({ message: 'Date alterado com sucesso', date: data });
  } catch (error) {
    console.error('Erro ao alterar date:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.finishDate = async (req, res) => {
  const { date_id, description, rating, date_img } = req.body;

  try {
    const { data: date, error: dateError } = await supabase
      .from('dates')
      .update([{ description: description, rating: rating, date_img: date_img, date_finished: true, modify_at: new Date(new Date().getTime() - (3 * 60 * 60 * 1000)).toISOString().slice(0, 16) }])
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
  const { task_id, couple_id } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Arquivo não enviado" });
  }

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('dates_images')
      .upload(`${couple_id}/${task_id}`, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = await supabase.storage
      .from('dates_images')
      .getPublicUrl(`${couple_id}/${task_id}`);

    res.status(200).json({ message: "Upload concluído", public_url: publicUrlData.publicUrl });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};

exports.DeleteDate = async (req, res) => {
  const { dateId } = req.query;

  try {
    const { data: deteleData, error: deteleError } = await supabase
      .from('dates')
      .delete()
      .eq('id', dateId);

    if (deteleError) {
      res.status(500).json({ message: "Erro ao excluir date " });
    }

    res.status(200).json({ message: "Date excluído com sucesso" });
  } catch {
    res.status(500).json({ message: error.message, error: error.message });
  }
};