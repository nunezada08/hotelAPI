import pg from 'pg';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import CategoriaQuartos from '@prisma/client';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela exemplo...');

    // Remove todos os registros
    // await prisma.exemplo.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.hospedes.createMany({
        data: [
            {
                nome: 'Taylor Swift',
                email: 'taylor@era-tour.com',
                telefone: '11 99999-88',
                cep: '01310-100',
                logradouro: 'Avenida Paulista',
                bairro: 'Bela Vista',
                localidade: 'São Paulo',
                uf: 'SP',
                quartos: {
                    create: [
                        {
                            nome: 'Suíte 13',
                            descricao: 'Vista panorâmica e isolamento acústico total.',
                            cateoria: CategoriaQuartos.SUITE,
                            preco: 45.799,
                            disponivel: false,
                        },
                    ],
                },
            },
        ],
    });
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('✅ Seed concluído!');
    });
