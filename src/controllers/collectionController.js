const supabase = require('../config/supabase');

exports.getCollectionsCouple = async (req, res) => {
    const { coupleId } = req.query;
    
    try {
        const { data: collections, error: collectionsError } = await supabase
            .from('collections')
            .select('*')
            .eq('couple_id', coupleId);

        if (collectionsError) {
            return res.status(400).json({ error: 'Erro ao buscar coleções do casal' });
        }

        res.status(200).json({ collections });
    } catch (error) {
        console.error('Erro ao buscar coleções do casal:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};