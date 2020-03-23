const fs = require('fs');
const docx = require('docx');

const readFile = path => {
  const fs = require('fs');
  const input = fs.readFileSync(path).toString();
  const sentences = input.split(`\r`);
  const entries = sentences.map(e => e.split('] '));
  entries.forEach(e => (e[0] += ']'));
  return entries;
};

const writeFile = async (entries, outPath) => {
  const doc = new docx.Document();
  const rows = entries.map(([time, content]) => {
    return new docx.TableRow({
      children: [
        new docx.TableCell({
          children: [
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: time + '\n',
                  bold: true,
                }),
                new docx.TextRun({
                  text: content,
                  bold: false,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });
  const table = new docx.Table({
    rows,
  });
  doc.addSection({
    children: [table],
  });

  const buffer = await docx.Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buffer);
};

module.exports = {
  readFile,
  writeFile,
};
