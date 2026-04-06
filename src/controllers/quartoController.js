import QuartosModel from "../models/QuartosModel.js";
import { processarFoto, removerFoto } from "../utils/fotoHelper.js";

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
