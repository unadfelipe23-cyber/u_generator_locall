const path = require('path');
const DocumentConfig = require('./src/features/generator/domain/documentConfig');
const DocumentExporterService = require('./src/features/generator/data/services/documentExporter');

async function main() {
    console.log("🚀 Initializing Universal Document Generator in Node.js...");

    const config = new DocumentConfig(
        "Universal Automated Report",
        "System Operator",
        "corporate",
        [
            { title: "Executive Summary", content: "Adapted perfectly for Spck Editor and Node.js environment." },
            { title: "Architecture Setup", content: "Modular services implemented using native JavaScript and npm libraries." },
            { title: "Deployment Status", content: "Ready for local execution or cloud deployment without errors." }
        ]
    );

    const outputDir = path.join(__dirname, 'output_documents');

    try {
        await DocumentExporterService.exportToExcel(config, path.join(outputDir, 'report.xlsx'));
        console.log("✅ Excel generated successfully!");

        await DocumentExporterService.exportToPpt(config, path.join(outputDir, 'presentation.pptx'));
        console.log("✅ PowerPoint generated successfully!");

        await DocumentExporterService.exportToWord(config, path.join(outputDir, 'document.docx'));
        console.log("✅ Word document generated successfully!");

        await DocumentExporterService.exportToPdf(config, path.join(outputDir, 'document.pdf'));
        console.log("✅ PDF document generated successfully!");

        console.log("🎉 All documents successfully generated inside /output_documents!");
    } catch (error) {
        console.error("❌ Error during generation:", error);
    }
}

main();
