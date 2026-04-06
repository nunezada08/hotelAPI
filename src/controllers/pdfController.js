import quartosModel from "../models/quartosModel.js";
import { gerarPdfQuarto, gerarPdfTodos } from "../utils/pdfHelper.js";

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
