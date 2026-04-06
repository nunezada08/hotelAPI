import quartosModel from "../models/quartosModel.js";
import { gerarPdfQuarto, gerarPdfTodos } from "../utils/pdfHelper.js";

/**
 * @typedef {object} reqBodyPdf
 */

/**
 * GET /quartos/relatorio/pdf
 * @tags Quartos
 * @summary Busca todos os registros de relatório de quartos e converte-os para PDF
 * @description EndPoint responsável por buscar quartos cadastrados no sisema web e transformá-los em PDF
 * 
 * @return 200 - Quartos encontrados e convertidos com sucesso
 * @return 404 - Quartos não encontrados
 * @return 500 - Erro interno do servidor
 */

export const relatorioTodos = async (req, res) => {
  try {
    const quartos = await quartosModel.buscarTodos();

    if (!quartos || quartos.length === 0) {
      return res.status(404).json({ error: "Nenhum quarto encontrado!" });
    }

    const pdf = await gerarPdfTodos(quartos);

    return res
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="quartos_relatorio.pdf"`,
      })
      .send(pdf);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return res.status(500).json({ error: "Erro ao gerar relatório." });
  }
};

/**
 * GET /quartos/relatorio/{id}
 * @tags Quartos
 * @summary Busca um registro de relatório de quarto e converte-o para PDF através do ID
 * @description EndPoint responsável por buscar quartos cadastrados no sisema web e transformá-los em PDF por ID
 * 
 * @param {integer} id.path.required
 * 
 * @return 200 - Quarto encontrado e convertido com sucesso
 * @return 400 - Dados inválidos
 * @return 404 - Quarto não encontrado
 * @return 500 - Erro interno do servidor
 */

export const relatorioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const quarto = await quartosModel.buscarPorId(parseInt(id));

    if (!quarto) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }

    const pdf = await gerarPdfQuarto(quarto);
    return res
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="quarto_${id}.pdf"`,
      })

      .send(pdf);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return res.status(500).json({ error: "Erro ao gerar relatório." });
  }
};
