import HospedeModel from "../models/HospedeModel.js";

/**
 * @typedef {object} reqBodyHospede
 * @property {string} nome.required
 * @property {string} email.required
 * @property {string} telefone.required
 * @property {string} cep.required
 * @property {boolean} ativo.required
 */

/**
 * POST /api/hospedes
 * @tags Hospedes
 * @summary Cria um novo registro de hospede
 * @description EndPoint responsável por cadastrar um novo hospede no sistema web.
 * @param {reqBodyHospede} request.body.required
 *
 * @return 201 - Hospede criado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 - Erro interno no servidor
 */

export const criar = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Corpo da requisição vazio. Envie os dados!" });
    }

    const { nome, email, telefone, cep, ativo } = req.body;

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
    if (!cep) {
      return res.status(400).json({ error: 'O campo "cep" é obrigatório!' });
    }
    if (ativo === undefined && typeof ativo !== "boolean") {
      return res
        .status(400)
        .json({ error: 'O campo "ativo" deve ser boolean!' });
    }

    const hospede = new HospedeModel({
      nome,
      estado,
      preco: parseFloat(preco),
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

/**
 * GET /api/hospedes
 * @tags Hospedes
 * @summary Busca todos os registros de hospedes
 * @description EndPoint responsável por buscar hospedes cadastrados no sistema web.
 * Permite filtrar os resultados utilizando parâmetros de consulta (query params).
 *
 * @param {string} nome.query
 * @param {string} email.query
 * @param {string} telefone.query
 * @param {string} cep.query
 * @param {boolean} ativo.query
 * 
 * @return {array<reqBodyHospede>} 200 - Lista de hóspedes encontrada com sucesso
 * @return {object} 404 - Nenhum hóspede encontrado
 * @return {object} 500 - Erro interno no servidor
 */

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

/**
 * GET /api/hospedes/{id}
 * @tags Hospedes
 * @summary Busca um registro de hospede por ID
 * @description EndPoint responsável por buscar um hospede específico cadastrado no sistema web a partir do ID.
 * @param {integer} id.path.required
 *
  * @return 200 - Hospede encontrado com sucesso
 * @return  400 - ID inválido
 * @return  404 - Hóspede não encontrado
 * @return  500 - Erro interno do servidor
 */

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

/**
 * PUT /api/hospedes/{id}
 * @tags Hospedes
 * @summary Atualiza um registro de hospede por ID
 * @description Endpoint responsável por atualizar hospede específico pelo seu ID.
 * @param {integer} id.path.required
 * @param {reqBodyHospede} request.body.required
 *
 *
 * @return 200 - ID do hospede encontrado
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - Erro ao atualizar ID do registro
 * @return 500 - Erro interno no servidor
 */

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
        message: O registro "${data.nome}" foi atualizado com sucesso!,
        data,
      });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return res.status(500).json({ error: "Erro ao atualizar hospede." });
  }
};

/**
 * DELETE /api/hospedes/{id}
 * @tags Hospedes
 * @summary Deleta um registro de hospede por ID
 * @description Endpoint responsável por deletar hospede específico pelo seu ID.
 * @param {integer} id.path.required
 *
 * @return 200 - ID do hospede encontrado
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - Erro ao deletar ID do registro
 * @return 500 - Erro interno no servidor
 */

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
        message: O hospede "${hospede.nome}" foi deletado com sucesso!,
        deletado: hospede,
      });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return res.status(500).json({ error: "Erro ao deletar hospede." });
  }
};