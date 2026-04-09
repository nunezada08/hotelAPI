import pg from "pg";
import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { CategoriaQuartos } from "@prisma/client";

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Resetando processo de Seed...");

  // Remove todos os registros
  // await prisma.exemplo.deleteMany();
  console.log("Limpando as tabelas existentes...");
  await prisma.quartos.deleteMany();
  await prisma.hospedes.deleteMany();

  console.log("📦 Inserindo novos registros de hóspedes...");

  const hospede1 = await prisma.hospedes.create({
    data:
      {
        nome: "Taylor Swift",
        email: "taylor@era-tour.com",
        telefone: "11 99999-88",
        cep: "01310-100",
        logradouro: "Avenida Paulista",
        bairro: "Bela Vista",
        localidade: "São Paulo",
        uf: "SP",
      },
  });

  const hospede2 = await prisma.hospedes.create({
    data:
      {
        nome: "Bruce Wayne",
        email: "bruce@waynecorp.com",
        telefone: "1197777-6666",
        cep: "01001-000",
        logradouro: "Praça da Sé",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
      },
  });
  const hospede3 = await prisma.hospedes.create({
    data: {
      nome: "Tony Stark",
      email: "tony@starkindustries.com",
      telefone: "11 98888-7777",
      cep: "04571-010",
      logradouro: "Avenida das Nações Unidas",
      bairro: "Brooklin Novo",
      localidade: "São Paulo",
      uf: "SP",
    },
  });

  const hospede4 = await prisma.hospedes.create({
    data: {
      nome: "Beyoncé Knowles",
      email: "queenb@parkwood.com",
      telefone: "21 97777-5555",
      cep: "22441-000",
      logradouro: "Avenida Delfim Moreira",
      bairro: "Leblon",
      localidade: "Rio de Janeiro",
      uf: "RJ",
    },
  });

  const hospede5 = await prisma.hospedes.create({
    data: {
      nome: "Clark Kent",
      email: "clark.kent@dailyplanet.com",
      telefone: "61 96666-4444",
      cep: "70070-000",
      logradouro: "Eixo Monumental",
      bairro: "Asa Sul",
      localidade: "Brasília",
      uf: "DF",
    },
  });

  const hospede6 = await prisma.hospedes.create({
    data: {
      nome: "Hermione Granger",
      email: "hermione@hogwarts.edu",
      telefone: "31 95555-3333",
      cep: "30140-061",
      logradouro: "Rua da Bahia",
      bairro: "Lourdes",
      localidade: "Belo Horizonte",
      uf: "MG",
    },
  });

  const hospede7 = await prisma.hospedes.create({
    data: {
      nome: "Peter Parker",
      email: "peter.parker@bugle.com",
      telefone: "11 94444-2222",
      cep: "05407-002",
      logradouro: "Rua Cardeal Arcoverde",
      bairro: "Pinheiros",
      localidade: "São Paulo",
      uf: "SP",
    },
  });

  const hospede8 = await prisma.hospedes.create({
    data: {
      nome: "Rihanna Fenty",
      email: "badgalriri@fenty.com",
      telefone: "71 93333-1111",
      cep: "40026-280",
      logradouro: "Largo do Pelourinho",
      bairro: "Pelourinho",
      localidade: "Salvador",
      uf: "BA",
    },
  });

  const hospede9 = await prisma.hospedes.create({
    data: {
      nome: "Sherlock Holmes",
      email: "elementary@bakerstreet.com",
      telefone: "41 92222-0000",
      cep: "80020-100",
      logradouro: "Rua XV de Novembro",
      bairro: "Centro",
      localidade: "Curitiba",
      uf: "PR",
    },
  });

  const hospede10 = await prisma.hospedes.create({
    data: {
      nome: "Lionel Messi",
      email: "leomessi@intermiami.com",
      telefone: "11 91010-1010",
      cep: "01414-000",
      logradouro: "Rua Oscar Freire",
      bairro: "Jardim Paulista",
      localidade: "São Paulo",
      uf: "SP",
    },
  });

  const hospede11 = await prisma.hospedes.create({
    data: {
      nome: "Walter White",
      email: "heisenberg@polloshermanos.com",
      telefone: "11 90000-8888",
      cep: "04012-000",
      logradouro: "Rua Vergueiro",
      bairro: "Vila Mariana",
      localidade: "São Paulo",
      uf: "SP",
    },
  });

  const hospede12 = await prisma.hospedes.create({
    data: {
      nome: "Lana Del Rey",
      email: "lana@oceanblvd.com",
      telefone: "21 98888-1234",
      cep: "22041-001",
      logradouro: "Avenida Atlântica",
      bairro: "Copacabana",
      localidade: "Rio de Janeiro",
      uf: "RJ",
    },
  });

  console.log("📦 Inserindo novos registros de quartos...");
  await prisma.quartos.createMany({
    data: [
      {
        nome: "Quarto Master 01",
        descricao: "Quarto discreto com vista para a praia.",
        categoria: CategoriaQuartos.LUXO,
        preco: 27845,
        disponivel: false,
        hospedeId: hospede1.id,
      },
      {
        nome: "Suíte 13",
        descricao:
          "Vista Panorâmica para a cidade e isolamento acústico completo.",
        categoria: CategoriaQuartos.SUITE,
        preco: 19345,
        disponivel: false,
        hospedeId: hospede2.id
      },
      {
        nome: "Stark Tower Suite",
        descricao: "Automação residencial completa com IA integrada.",
        categoria: CategoriaQuartos.LUXO,
        preco: 85000,
        disponivel: false,
        hospedeId: hospede3.id,
      },
      {
        nome: "Renaissance Room",
        descricao: "Decoração clássica com toques modernos de ouro.",
        categoria: CategoriaQuartos.LUXO,
        preco: 45000,
        disponivel: false,
        hospedeId: hospede4.id,
      },
      {
        nome: "Quarto Daily Planet",
        descricao: "Ambiente calmo, perfeito para escrever e relaxar.",
        categoria: CategoriaQuartos.SIMPLES,
        preco: 350,
        disponivel: false,
        hospedeId: hospede5.id,
      },
      {
        nome: "Torre de Hogwarts",
        descricao: "Estantes cheias de livros e luz de velas (LED).",
        categoria: CategoriaQuartos.SUITE,
        preco: 1200,
        disponivel: false,
        hospedeId: hospede6.id,
      },
      {
        nome: "Quarto do Queens",
        descricao: "Simples, aconchegante e com ótima conexão Wi-Fi.",
        categoria: CategoriaQuartos.SIMPLES,
        preco: 200,
        disponivel: false,
        hospedeId: hospede7.id,
      },
      {
        nome: "Diamond Suite",
        descricao: "Suíte extremamente iluminada com acabamento em cristal.",
        categoria: CategoriaQuartos.LUXO,
        preco: 32000,
        disponivel: false,
        hospedeId: hospede8.id,
      },
      {
        nome: "Baker Street Room",
        descricao: "Quarto com lareira e poltronas de couro para pensar.",
        categoria: CategoriaQuartos.SUITE,
        preco: 2500,
        disponivel: false,
        hospedeId: hospede9.id,
      },
      {
        nome: "Suíte Rosário",
        descricao: "Conforto de campeão com vista para campo de treino.",
        categoria: CategoriaQuartos.LUXO,
        preco: 15000,
        disponivel: false,
        hospedeId: hospede10.id,
      },
      {
        nome: "Blue Lab Room",
        descricao: "Quarto minimalista com ventilação avançada.",
        categoria: CategoriaQuartos.SIMPLES,
        preco: 600,
        disponivel: false,
        hospedeId: hospede11.id,
      },
      {
        nome: "Ocean Boulevard",
        descricao: "Estética vintage, som de vinil e flores frescas.",
        categoria: CategoriaQuartos.SUITE,
        preco: 3800,
        disponivel: false,
        hospedeId: hospede12.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("✅ Seed concluído!");
  });
