const supabase = require('../config/supabase');
const crypto = require('crypto');

exports.existUserInCouple = async (req, res) => {
  const { userId } = req.query;

  try {
    const { data: users, error: userError } = await supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (userError) {
      return res.status(400).json({ error: 'Erro ao buscar dados dos usuários' });
    }

    const isUserInCouple = users && users.length > 0;
    res.status(200).json({ exists: isUserInCouple });
  } catch (error) {
    console.error('Erro ao buscar dados dos usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getCoupleData = async (req, res) => {
  const { userId } = req.query;

  try {
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single();

    if (coupleError) {
      return res.status(400).json({ error: 'Erro ao buscar dados do casal' });
    }

    res.status(200).json({ couple });
  } catch (error) {
    console.error('Erro ao buscar dados do casal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getAllTasks = async (req, res) => {
  const { coupleId } = req.query;

  try {
    const { data: allDates, error: allDatesError } = await supabase
      .from('dates')
      .select('*')
      .eq('couple_id', coupleId);

      if(allDatesError) throw allDatesError;

    res.status(200).json({ allDates });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.uploadImage = async (req, res) => {
  const { couple_id } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Arquivo não enviado" });
  }

  try {
    const { data: imgData, error: imgDataError } = await supabase.storage
      .from('couple_images')
      .list(couple_id);

    if (imgDataError) {
      throw new Error("Erro ao buscar imagens existentes no bucket");
    }

    const nameFile = imgData.length > 0 ? imgData[0].name : crypto.randomUUID();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('couple_images')
      .upload(`${couple_id}/${nameFile}`, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = await supabase.storage
      .from('couple_images')
      .getPublicUrl(`${couple_id}/${nameFile}`);

    if (!publicUrlData.publicUrl) {
      throw new Error("Erro ao gerar URL pública da imagem");
    }

    const { error: updateError } = await supabase
      .from('couples')
      .update({ couple_img: publicUrlData.publicUrl })
      .eq('id', couple_id);

    if (updateError) throw updateError;

    res.status(200).json({ message: "Upload concluído", public_url: publicUrlData.publicUrl });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erro interno", error: error.message });
  }
};

exports.updateCategories = async (req, res) => {
  const { coupleId, category } = req.body;

  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('couples')
      .select('dates_categories')
      .eq('id', coupleId)
      .single();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    const updatedCategories = currentData.dates_categories ? [...currentData.dates_categories, category] : [category];

    const { data, error } = await supabase
      .from('couples')
      .update({ dates_categories: updatedCategories })
      .eq('id', coupleId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error occurred." });
  }
}

exports.updateCoupleData = async (req, res) => {
  const { couple_id, couple_img, couple_name, since } = req.body;

  try {
    const { data: coupleData, error: coupleError } = await supabase
      .from('couples')
      .update([{ couple_img: couple_img, couple_name: couple_name, since: since, modify_at: new Date() }])
      .eq('id', couple_id);

    if (coupleError) throw coupleError;
    res.status(200).json({ message: "dados atualizados com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erro interno", error: error.message });
  }
}