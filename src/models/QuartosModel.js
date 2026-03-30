import prisma from '../utils/prismaClient.js';

const categoriasQuarto = ['PADRAO', 'LUXO', 'SUITE', 'FAMILIA'];

export default class QuartosModel {
    constructor({
        id = null,
        nome,
        descricao = null,
        categoria,
        disponivel = true,
        preco,
        foto = null,
        hospedeId = null,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.disponivel = disponivel;
        this.preco = preco;
        this.foto = foto;
        this.hospedeId = hospedeId;
    }

    validar() {
        if (!this.nome || this.nome.trim() === '') {
            throw new Error('O nome é um campo obrigatório.');
        }
        if (!categoriasQuarto.includes(this.categoria)) {
            throw new Error(
                `A categoria selecionada é inválida. As categorias válidas são: ${categoriasQuarto}`,
            );
        }
        if (isNaN(this.preco) || this.preco < 0) {
            throw new Error('O preço deve ser um número maior ou igual a 0');
        }
        if (this.disponivel === undefined) {
            throw new Error('A disponibilidade do quarto é obrigatória.');
        }
        if (this.disponivel === false ) {
            throw new Error('O quarto não está disponível.');
        }
    }

    async criar() {
        this.validar();

        const registro = await prisma.quartos.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                preco: this.preco,
                foto: null,
                hospedeId: this.hospedeId,
            },
        });

        this.id = registro.id;
        return registro;
    }

    async atualizar() {
        if (!this.id) throw new Error('ID do quarto é necessário para a atualização.');

        return prisma.quartos.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                disponivel: this.disponivel,
                preco: this.preco,
                foto: this.foto,
            },
        });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }

        if (filtros.disponivel !== undefined) {
            where.disponivel = String(filtros.disponivel) === 'true';
        }

        return prisma.quartos.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.quartos.findUnique({
            where: { id: Number(id) },
        });

        if (!data) return null;
        return new QuartosModel(data);
    }

    async deletar() {
        return prisma.quartos.delete({ where: { id: this.id } });
    }

}
