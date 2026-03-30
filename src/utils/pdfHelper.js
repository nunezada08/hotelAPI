import htmlPdf from 'html-pdf-node';
import fs from 'fs';

export async function gerarPdfAluno(hospede) {
    let fotoHtml = '-';

    if (hospede.foto) {
        const base64 = fs.readFileSync(hospede.foto).toString('base64');
        fotoHtml = `<img src="data:image/jpeg;base64, ${base64}" width="80" style="border-radius: 15px;"/>`;
    }

    const html = `<!DOCTYPE html>
<html>
    <body>
        <h1 style="text-align: center;">Relatorio do Hospede</h1>

        <p style="text-align: center;">Foto: ${fotoHtml}</p>
        <p style="text-align: center;">Nome: ${hospede.nome}</p>
        <p style="text-align: center;">Email: ${hospede.email || '-'}</p>
        <p style="text-align: center;">telefone: ${hospede.telefone || '-'}</p>
        <p style="text-align: center;">cep: ${hospede.cep || '-'}</p>
        <p style="text-align: center;">logradouro: ${hospede.logradouro || '-'}</p>
        <p style="text-align: center;">bairro: ${hospede.bairro || '-'}</p>
        <p style="text-align: center;">localidade: ${hospede.localidade || '-'}</p>
        <p style="text-align: center;">uf: ${hospede.uf || '-'}</p>
    </body>
</html>`;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}

export async function gerarPdfTodos(hospedes) {
    const linhas = hospedes
        .map(
            (a) => `
    <tr>
        <td>${a.nome}</td>
        <td>${a.email || '-'}</td>
        <td>${a.telefone || '-'}</td>
        <td>${a.cep || '-'}</td>
        <td>${a.logradouro || '-'}</td>
        <td>${a.bairro || '-'}</td>
        <td>${a.localidade || '-'}</td>
        <td>${a.uf || '-'}</td>
        <td>${a.ativo}</td>
        <td>${a.foto || '-'}</td>
    </tr>
    `,
        )
        .join('');

    const html = `
<h1 style="text-align: center;">Relatorio de Hospedes</h1>

<table border="1" cellspacing="0" cellspacing="8">
    <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Telefone</th>
        <th>Cep</th>
        <th>Logradouro</th>
        <th>Bairro</th>
        <th>Localidade</th>
        <th>Uf</th>
        <th>Ativo</th>
        <th>Foto</th>
    </tr>
    ${linhas}
</table>

<p>Total: ${hospedes.length}</p>
`;
    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}
