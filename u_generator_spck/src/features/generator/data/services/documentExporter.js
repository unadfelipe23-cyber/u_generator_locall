const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const pptxgen = require('pptxgenjs');
const PDFDocument = require('pdfkit');
const DesignSeedEngine = require('../../../../core/designSeedEngine');

class DocumentExporterService {
    static async exportToExcel(config, outputPath) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Report Data');
        const palette = DesignSeedEngine.getPalette(config.theme);

        sheet.addRow(["Section Title", "Content / Description", "Author", "Theme"]);
        const headerRow = sheet.getRow(1);
        headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: palette.primary } };
        });

        config.sections.forEach(sec => {
            sheet.addRow([sec.title, sec.content, config.author, config.theme]);
        });

        this.ensureDirectoryExistence(outputPath);
        await workbook.xlsx.writeFile(outputPath);
        return outputPath;
    }

    static async exportToPpt(config, outputPath) {
        let pptx = new pptxgen();
        let slide = pptx.addSlide();
        slide.addText(config.title, { x: 1, y: 1.5, fontSize: 24, bold: true, color: '1F4E78' });
        slide.addText(`Author: ${config.author} | Theme: ${config.theme}`, { x: 1, y: 2.5, fontSize: 14, color: '595959' });

        config.sections.forEach(sec => {
            let contentSlide = pptx.addSlide();
            contentSlide.addText(sec.title, { x: 0.8, y: 0.8, fontSize: 20, bold: true, color: '1F4E78' });
            contentSlide.addText(sec.content, { x: 0.8, y: 1.8, fontSize: 14, color: '2C2C2C', w: '80%' });
        });

        this.ensureDirectoryExistence(outputPath);
        await pptx.writeFile({ fileName: outputPath });
        return outputPath;
    }

    static async exportToWord(config, outputPath) {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ text: config.title, heading: HeadingLevel.TITLE }),
                    new Paragraph({
                        children: [new TextRun({ text: `Author: ${config.author} | Theme: ${config.theme}`, italics: true, color: "555555" })],
                        spacing: { after: 200 }
                    }),
                    ...config.sections.flatMap(sec => [
                        new Paragraph({ text: sec.title, heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }),
                        new Paragraph({ text: sec.content, spacing: { after: 150 } })
                    ])
                ]
            }]
        });

        const buffer = await Packer.toBuffer(doc);
        this.ensureDirectoryExistence(outputPath);
        fs.writeFileSync(outputPath, buffer);
        return outputPath;
    }

    static async exportToPdf(config, outputPath) {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExistence(outputPath);
            const doc = new PDFDocument({ margin: 54 });
            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            doc.fontSize(18).font('Helvetica-Bold').text(config.title, { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica-Oblique').fillColor('#555555').text(`Author: ${config.author} | Theme: ${config.theme}`);
            doc.moveDown(1);

            config.sections.forEach(sec => {
                doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text(sec.title);
                doc.moveDown(0.3);
                doc.fontSize(11).font('Helvetica').fillColor('#2C2C2C').text(sec.content);
                doc.moveDown(1);
            });
            doc.end();
            stream.on('finish', () => resolve(outputPath));
            stream.on('error', (err) => reject(err));
        });
    }

    static ensureDirectoryExistence(filePath) {
        const dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) return true;
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }
}

module.exports = DocumentExporterService;
