const supabase = require('../config/supabase');

exports.existUserInCouple = async (req, res) => {
  const { userId } = req.params;

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

// Função para buscar os dados do casal baseado no ID do usuário
exports.getCoupleData = async (req, res) => {
  const { userId } = req.params;

  try {
    // Consulta os dados do casal onde o usuário seja user1 ou user2
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single();

    if (coupleError) {
      return res.status(400).json({ error: 'Erro ao buscar dados do casal' });
    }

    // Retorna os dados do casal
    res.status(200).json({ couple });
  } catch (error) {
    console.error('Erro ao buscar dados do casal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getAllTasks = async (req, res) => {
  const { coupleId } = req.params;

  try {
    const { data: lists, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('couple_id', coupleId);

    if (listError || !lists) {
      return res.status(400).json({ error: 'Erro ao buscar listas de tarefas' });
    }

    // Criar um array para armazenar todas as tarefas
    const allTasks = [];

    // Buscar tarefas para cada lista encontrada
    for (const list of lists) {
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('list_id', list.id);

      if (tasksError) {
        return res.status(400).json({ error: 'Erro ao buscar tarefas da lista' });
      }

      // Adicionar tarefas à lista de todas as tarefas
      allTasks.push(...tasks);
    }

    // Retornar todas as tarefas
    res.status(200).json({ allTasks });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Função para buscar o número de tarefas concluídas pelo casal
exports.getCompletedTasksCount = async (req, res) => {
  const { coupleId } = req.params;

  try {
    // Busca as listas de tarefas do casal
    const { data: lists, error: listError } = await supabase
      .from('lists')
      .select('id')
      .eq('couple_id', coupleId);

    if (listError) {
      return res.status(400).json({ error: 'Erro ao buscar listas de tarefas' });
    }

    if (lists.length === 0) {
      return res.status(200).json({ completedTasksCount: 0 });
    }

    const listIds = lists.map((list) => list.id);

    // Busca as tarefas concluídas com base nos IDs das listas
    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select('status')
      .in('list_id', listIds);

    if (taskError) {
      return res.status(400).json({ error: 'Erro ao buscar tarefas' });
    }

    const completedTasksCount = tasks.filter((task) => task.status === 'concluída').length;

    res.status(200).json({ completedTasksCount });
  } catch (error) {
    console.error('Erro ao buscar tarefas concluídas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
