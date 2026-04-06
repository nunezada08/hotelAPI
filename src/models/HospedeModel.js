import prisma from "../utils/prismaClient.js";

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
        ativo = true,
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
        if (!this.nome || this.nome.length < 3 || this.nome.length > 100) {
            throw new Error('Nome deve ter entre 3 a 100 caracteres');
        }

        if (!this.email) {
            throw new Error('Email é obrigatório');
        }

        if (!this.cep) {
            throw new Error('CEP obrigatório e deve ter 8 dígitos');
        }

        if (this.ativo === false) {
            throw new Error('Operação não permitida: cliente inativo');
        }

        let cep = '';

        if (this.cep) {
            const cepString = String(this.cep);
            for (let i = 0; i < cepString.length; i++) {
                const caractere = cepString[i];
                if (caractere >= '0' && caractere <= '9') {
                    cep += caractere;
                }
            }
        }

        if (cep.length !== 8) {
            throw new Error('O campo "cep" deve conter 8 dígitos numericos.');
        }

        if (this.localidade) {
            throw new Error('O campo "localidade" é obrigatório.');
        }

        this.cep = cep;
    }

    async enderecoPorCep() {
        if (!this.cep) return;

        let cep = '';
        const cepString = String(this.cep);
        for (let i = 0; i < cepString.length; i++) {
            const caractere = cepString[i];
            if (caractere >= '0' && caractere <= '9') {
                cep += caractere;
            }
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json`);

            const dados = await resposta.json();

            if (dados.erro) {
                throw new Error('CEP não encontrado.');
            }

            this.logradouro = dados.logradouro || null;
            this.bairro = dados.bairro || null;
            this.localidade = dados.localidade || null;
            this.uf = dados.uf || null;
        } catch {
            throw new Error('Erro ao buscar endereco pelo CEP: ' + error.message);
        }
    }

    async criar() {
        this.validarCampos();
        await this.enderecoPorCep();

        return prisma.hospedes.create({
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        if (this.ativo === false) {
            throw new Error('Operação não permitida: hospede inativo');
        }

        this.validarCampos();
        if (this.cep) await this.enderecoPorCep();

        return prisma.hospedes.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                email: this.email,
                telefone: this.telefone,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        if (this.ativo == false) {
            throw new Error('Operação não permitida: cliente inativo');
        }
        return prisma.hospedes.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        if (filtros.localidade) {
            where.localidade = { contains: filtros.localidade, mode: 'insensitive' };
        }

        if (filtros.email) {
            where.email = { contains: filtros.email, mode: 'insensitive' };
        }

        if (filtros.cpf) {
            where.cpf = { contains: filtros.cpf, mode: 'insensitive' };
        }

        if (filtros.dominio) {
            where.email = {
                endWith: `@${String(filtros.dominio).toLowerCase()}`,
                mode: 'insensitive',
            };
        }

        if (filtros.localidade) {
            where.localidade = { contains: filtros.localidade, mode: 'insensitive' };
        }

        if (filtros.ativo !== undefined) {
            where.ativo = filtros.ativo === 'true';
        }

        return prisma.hospedes.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.hospedes.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new HospedeModel(data);
    }

    async deletar() {
        if (this.ativo == false) {
            throw new Error('Operação não permitida: cliente inativo');
        }
        return prisma.hospedes.delete({ where: { id: this.id } });
    }
}
