import HospedeModel from '../models/HospedeModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, estado, preco } = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (preco === undefined || preco === null) {
            return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
        }

        const hospede = new HospedeModel({ nome, estado, preco: parseFloat(preco) });
        const data = await hospede.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await HospedeModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const hospede = await HospedeModel.buscarPorId(parseInt(id));

        if (!hospede) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: hospede });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const hospede = await HospedeModel.buscarPorId(parseInt(id));

        if (!hospede) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            hospede.nome = req.body.nome;
        }
        if (req.body.estado !== undefined) {
            hospede.estado = req.body.estado;
        }
        if (req.body.preco !== undefined) {
            hospede.preco = parseFloat(req.body.preco);
        }

        const data = await hospede.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const hospede = await HospedeModel.buscarPorId(parseInt(id));

        if (!hospede) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await hospede.deletar();

        return res.status(200).json({ message: `O registro "${hospede.nome}" foi deletado com sucesso!`, deletado: hospede });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
