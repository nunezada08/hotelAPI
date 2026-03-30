import htmlPdf from 'html-pdf-node';
import fs from 'fs';

export async function gerarPdfQuarto(quarto) {
    let fotoHtml = '-';

    if (quarto.foto) {
        const base64 = fs.readFileSync(quarto.foto).toString('base64');
        fotoHtml = `<img src="data:image/jpeg;base64, ${base64}" width="80" style="border-radius: 15px;"/>`;
    }

    const html = `<!DOCTYPE html>
<html>
    <body>
        <h1 style="text-align: center;">Relatorio do quarto</h1>

        <p style="text-align: center;">Foto: ${fotoHtml}</p>
        <p style="text-align: center;">Nome: ${quarto.nome}</p>
        <p style="text-align: center;">Descrição: ${quarto.descricao || '-'}</p>
        <p style="text-align: center;">Categoria: ${quarto.categoria || '-'}</p>
        <p style="text-align: center;">Disponivel: ${quarto.disponivel || '-'}</p>
        <p style="text-align: center;">preco: ${quarto.preco || '-'}</p>
    </body>
</html>`;

    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}


export async function gerarPdfTodos(quartos) {
    const linhas = quartos
        .map(
            (a) => `
    <tr>
        <td>${a.nome}</td>
        <td>${a.descricao || '-'}</td>
        <td>${a.categoria || '-'}</td>
        <td>${a.disponivel || '-'}</td>
        <td>${a.preco || '-'}</td>
        <td>${a.foto || '-'}</td>
    </tr>
    `,
        )
        .join('');

    const html = `
<h1 style="text-align: center;">Relatorio de quartos</h1>

<table border="1" cellspacing="0" cellspacing="8">
    <tr>
        <th>Nome</th>
        <th>Descricao</th>
        <th>Categoria</th>
        <th>Disponivel</th>
        <th>Preco</th>
        <th>Foto</th>
    </tr>
    ${linhas}
</table>

<p>Total: ${quartos.length}</p>
`;
    return htmlPdf.generatePdf({ content: html }, { format: 'A4' });
}
