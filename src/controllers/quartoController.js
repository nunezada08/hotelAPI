import QuartosModel from "../models/QuartosModel.js";
import { processarFoto, removerFoto } from "../utils/fotoHelper.js";

/**
 * @typedef {object} reqBodyQuarto
 * @property {string} nome.required
 * @property {string} descricao.required
 * @property {boolean} disponivel.required
 * @property {decimal} preco.required
 * @property {boolean} foto.required
 * @property {Integer} hospedeId.required
 */

export const uploadFoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({
          error: "Nenhum arquivo enviado. Envie uma foto para o quarto!",
        });
    }

    const quarto = await QuartosModel.buscarPorId(parseInt(id));
    if (!quarto) {
      removerFoto(req.file.path);
      return res
        .status(404)
        .json({ error: "Quarto não encontrado para associar a foto." });
    }

    if (quarto.foto) {
      removerFoto(quarto.foto);
    }

    const caminhoProcessado = await processarFoto(req.file.path);

    quarto.foto = caminhoProcessado;
    await quarto.atualizar();

    return res
      .status(200)
      .json({
        message: "Foto atualizada com sucesso!",
        foto: caminhoProcessado,
      });
  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error);
    return res.status(500).json({ error: "Erro ao processar a foto." });
  }
};

/**
 * POST /api/Quartos
 * @tags Quartos
 * @summary Cria um novo registro de quarto
 * @description EndPoint responsável por cadastrar um novo quarto no sistema web
 * @param {ReqBodyQuarto} request.body.required
 *
 * @return 201 - Quarto criado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 - Erro interno do servidor
 */
export const criar = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Corpo da requisição vazio. Envie os dados!" });
    }

    const { nome, estado, preco } = req.body;

    if (!nome) {
      return res
        .status(400)
        .json({ error: 'O campo "nome" é obrigatório para criar um quarto!' });
    }
    if (!categoria)
      return res.status(400).json({
        error: 'O campo "categoria" é obrigatório',
      });

    if (preco === undefined || preco === null) {
      return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
    }

    const quarto = new QuartosModel({ nome, estado, preco: parseFloat(preco) });
    const data = await quarto.criar();
    console.error("Erro ao criar:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao salvar o registro." });
  } catch (error) {
    console.error("Erro ao fazer uploads da foto:", error);
    return res.status(500).json({ error: "Erro ao processar a foto." });
  }
};

/**
 * GET /api/quartos
 * @tags Quartos
 * @summary Busca todos os registros de Quartos
 * @description EndPoint responsável por buscar todos os quartos cadastrados no sistema web.
 * Permite filtrar os resultados utilizando parâmetros de consulta (query params).
 * @param {string} nome.query
 * @param {string} descricao.query
 * @param {string} categoria.query
 * @param {boolean} disponivel.query
 * @param {decimal} preco.query
 * @param {string} foto.query
 * @param {boolean} HospedeId.query
 *
 * @return 201 - Quarto criado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 -  Erro interno do servidor
 */
export const buscarTodos = async (req, res) => {
  try {
    const registros = await QuartosModel.buscarTodos(req.query);

    if (!registros || registros.length === 0) {
      return res.status(400).json({ message: "Nenhum registro encontrado." });
    }

    return res.status(200).json(registros);
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return res.status(500).json({ error: "Erro ao buscar registros." });
  }
};

/**
 * GET /quartos/{id}
 * @tags Quartos
 * @summary Busca um registro de quarto através do ID
 * @description EndPoint responsável por buscar quartos cadastrados no sistema web por ID
 *
 * @param {integer} id.path.required
 *
 * @return 200 - Quarto encontrado com sucesso
 * @return 400 - Dados inválidos
 * @return 404 - Quarto não encontrado
 * @return 500 - Erro interno do servidor
 */

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const exemplo = await QuartosModel.buscarPorId(parseInt(id));

    if (!exemplo) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }

    return res.status(200).json({ data: exemplo });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return res.status(500).json({ error: "Erro ao buscar registro." });
  }
};

/**
 * PUT /api/quartos/{id}
 * @tags Quartos
 * @summary Atualiza um registro de quarto por id
 * @description Endpoint responsável por buscar quarto específico pelo seu ID.
 * @param {integer} id.path.required
 *
 * @return 200 - ID do quarto encontrado
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - Erro ao buscar ID do registro
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

    const exemplo = await QuartosModel.buscarPorId(parseInt(id));

    if (!exemplo) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para atualizar." });
    }

    if (req.body.nome !== undefined) {
      exemplo.nome = req.body.nome;
    }
    if (req.body.estado !== undefined) {
      exemplo.estado = req.body.estado;
    }
    if (req.body.preco !== undefined) {
      exemplo.preco = parseFloat(req.body.preco);
    }

    const data = await exemplo.atualizar();

    return res
      .status(200)
      .json({
        message: `O registro "${data.nome}" foi atualizado com sucesso!`,
        data,
      });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return res.status(500).json({ error: "Erro ao atualizar registro." });
  }
};

/**
 * DELETE /api/quartos/{id}
 * @tags Quartos
 * @summary Deleta um registro de quarto por ID
 * @description EndPoint responsável por deletar um quarto específico cadastrado no sistema web a partir do ID.
 * @param {integer} id.path.required
 *
 * @return 200 - Quarto deletado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 404 - ID não encontrado
 * @return 500 - Erro interno do servidor
 */

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const exemplo = await QuartosModel.buscarPorId(parseInt(id));

    if (!exemplo) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para deletar." });
    }

    await exemplo.deletar();

    return res
      .status(200)
      .json({
        message: `O registro "${exemplo.nome}" foi deletado com sucesso!`,
        deletado: exemplo,
      });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return res.status(500).json({ error: "Erro ao deletar registro." });
  }
};
