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
