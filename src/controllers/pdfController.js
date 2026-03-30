import hospedesModel from '../models/hospedesModel.js';
import { gerarPdfTodos, gerarPdfAluno } from '../utils/pdfHelper.js';

export const relatorioTodos = async (req, res) => {
    try {
        const hospedes = await hospedesModel.buscarTodos();

        if (!hospedes || hospedes.length === 0) {
            return res.status(404).json({ error: 'Nenhum hospede encontrado!' });
        }

        const pdf = await gerarPdfTodos(hospedes);

        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="hospedes_relatorio.pdf"`,
            })
            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório.' });
    }
};

export const relatorioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const hospede = await hospedesModel.buscarPorId(parseInt(id));

        if (!hospede) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        const pdf = await gerarPdfAluno(hospede);
        return res
            .set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="hospede_${id}.pdf"`,
            })

            .send(pdf);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório.' });
    }
};
