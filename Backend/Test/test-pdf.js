// Script de prueba para generar un PDF simple y verificar que pdfkit funciona
const PDFDocument = require('pdfkit');
const fs = require('fs');

console.log('Iniciando test de PDF...');

try {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream('test-output.pdf');

    doc.pipe(stream);

    doc
        .fontSize(18)
        .text('Test de PDF', { align: 'center' })
        .moveDown(2);

    doc
        .fontSize(12)
        .text('Empleado: Juan Pérez')
        .text('Fecha: 07/02/2026')
        .text('Hora de entrada: 17:39:08')
        .text('Hora de salida: 17:53:12')
        .moveDown();

    doc
        .fontSize(12)
        .text('Empleado: María García')
        .text('Fecha: 08/02/2026')
        .text('Hora de entrada: 11:52:44')
        .text('Hora de salida: Sin salida')
        .moveDown();

    doc.end();

    stream.on('finish', () => {
        console.log('✅ PDF generado exitosamente en test-output.pdf');
        console.log('El archivo debería estar en:', __dirname + '/test-output.pdf');
    });

    stream.on('error', (err) => {
        console.error('❌ Error al escribir el PDF:', err);
    });

} catch (error) {
    console.error('❌ Error crítico:', error);
}
