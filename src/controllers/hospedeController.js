import HospedeModel from "../models/HospedeModel.js";

/**
 * @typedef {object} reqBodyHospede
 * @property {string} nome.required
 * @property {string} .required
 * @property {string} localidade
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const criar = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Corpo da requisição vazio. Envie os dados!" });
    }

    const { nome, email, telefone, cep, logradouro, bairro, localidade, uf, ativo } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
    }

    if (!email) {
      return res.status(400).json({ error: 'O campo "email" é obrigatório!' });
    }

      if (!telefone) {
          return res
              .status(400)
              .json({ error: 'O campo "telefone" é obrigatório!' });
      }

    if (ativo !== undefined && typeof ativo !== "boolean") {
      return res
        .status(400)
        .json({ error: 'O campo "ativo" deve ser boolean!' });
    }

    const hospede = new HospedeModel({
        nome,
        email,
        telefone,
        cep,
        logradouro,
        bairro,
        localidade,
        uf,
        ativo,
    });

    const data = await hospede.criar();

    return res
      .status(201)
      .json({ message: "Registro criado com sucesso!", data });
  } catch (error) {
    console.error("Erro ao criar:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao salvar o registro." });
  }
};

export const buscarTodos = async (req, res) => {
  try {
    const hospedes = await HospedeModel.buscarTodos(req.query);

    if (!hospedes || hospedes.length === 0) {
      return res.status(400).json({ message: "Nenhum hospedes encontrado." });
    }

    return res.status(200).json(hospedes);
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return res.status(500).json({ error: "Erro ao buscar hospedes." });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const hospede = await HospedeModel.buscarPorId(parseInt(id));

    if (!hospede) {
      return res.status(404).json({ error: "Hospede não encontrado." });
    }

    return res.status(200).json({ data: hospede });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return res.status(500).json({ error: "Erro ao buscar hospede." });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Corpo da requisição vazio. Envie os dados!" });
    }

    const hospede = await HospedeModel.buscarPorId(parseInt(id));

    if (!hospede) {
      return res
        .status(404)
        .json({ error: "Hospede não encontrado para atualizar." });
    }
    if (req.body.nome !== undefined) {
      hospede.nome = req.body.nome;
    }
    if (req.body.email !== undefined) {
      hospede.email = req.body.email;
    }
    if (req.body.telefone !== undefined) {
      hospede.telefone = req.body.telefone;
    }

    const data = await hospede.atualizar();

    return res
      .status(200)
      .json({
        message: `O registro "${data.nome}" foi atualizado com sucesso!`,
        data,
      });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return res.status(500).json({ error: "Erro ao atualizar hospede." });
  }
};

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const hospede = await HospedeModel.buscarPorId(parseInt(id));

    if (!hospede) {
      return res
        .status(404)
        .json({ error: "Hospede não encontrado para deletar." });
    }

    await hospede.deletar();

    return res
      .status(200)
      .json({
        message: `O hospede "${hospede.nome}" foi deletado com sucesso!`,
        deletado: hospede,
      });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return res.status(500).json({ error: "Erro ao deletar hospede." });
  }
};
