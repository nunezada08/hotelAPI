import prisma from '../utils/prismaClient.js';

export default class HospedeModel {
    constructor({
        id = null,
        nome,
        email = null,
        telefone = null,
        cep = null,
        logradouro = null,
        bairro = null,
        localidade = null,
        uf = null,
        ativo = true
    } = {}) {

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    validarCampos() {
        if (!this.nome || this.nome.trim().length < 3 || this.nome.trim().length > 100) {
            throw new Error("Nome deve ter entre 3 a 100 caracteres");
        }
        if (!this.email || !/^[^\s@]+@[^\s@].[^\s@]+$/.test(this.email.trim())) {
            throw new Error("Email obrigatório e deve ser válido");
        }
        if (!this.cpf || !/^\d{11}$/.test(this.cpf.trim())) {
            throw new Error("CPF obrigatório e deve ter 11 dígitos");
        }
    }

    validarAtivo() {
        if (!this.ativo) {
            throw new Error("Operação não permitida: usuário inativo")
        }
    }

    async criar() {
        return prisma.hospede.create({
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo
            },
        });
    }

    async atualizar() {
        this.validarCampos();
        this.validarAtivo();
        return prisma.hospede.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                email: this.email,
                cpf: this.cpf,
            },
        });
    }

    async deletar() {
        return prisma.hospede.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.email) {
            where.email = { contains: filtros.email, mode: 'insensitive' };
            if (filtros.ativo !== undefined) {
                where.ativo = filtros.ativo === 'true';
            }

            return prisma.hospede.findMany({ where });
        }
    }
    static async buscarPorId(id) {
        const data = await prisma.hospede.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new HospedeModel(data);
    }
}
