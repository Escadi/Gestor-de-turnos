const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');

exports.generatePdf = (req, res) => {
    try {
        const data = req.body;

        console.log('=== DATOS RECIBIDOS EN BACKEND ===');
        console.log('Body completo:', JSON.stringify(data, null, 2));

        // Validar que existan los datos
        if (!data || !data.fichajes || !Array.isArray(data.fichajes)) {
            console.error('ERROR: Datos inválidos o fichajes no es un array');
            return res.status(400).json({
                success: false,
                message: 'Datos inválidos: se requiere un array de fichajes'
            });
        }

        if (data.fichajes.length === 0) {
            console.error('ERROR: Array de fichajes está vacío');
            return res.status(400).json({
                success: false,
                message: 'No hay fichajes para generar el PDF'
            });
        }

        console.log(`Generando PDF con ${data.fichajes.length} fichajes`);

        const doc = new PDFDocument({ margin: 40 });

        // Manejar errores del stream
        doc.on('error', (err) => {
            console.error('ERROR en PDFDocument:', err);
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=fichajes.pdf');

        doc.pipe(res);

        // TÍTULO
        doc
            .fontSize(18)
            .text('Informe de fichajes', { align: 'center' })
            .moveDown(2);

        // CONTENIDO
        data.fichajes.forEach((t, i) => {
            console.log(`Procesando fichaje ${i + 1}:`, t);
            doc
                .fontSize(12)
                .text(`Numero de empleado: ${t.numeroEmpleado || 'N/A'}`)
                .text(`Empleado: ${t.empleado || 'N/A'}`)
                .text(`Fecha: ${t.fecha || 'N/A'}`)
                .text(`Hora de entrada: ${t.horaEntrada || 'N/A'}`)
                .text(`Hora de salida: ${t.horaSalida || 'Sin salida'}`)
                .moveDown();
        });

        console.log('PDF generado exitosamente, finalizando documento...');
        doc.end();
    } catch (error) {
        console.error('ERROR CRÍTICO generando PDF:', error);
        console.error('Stack trace:', error.stack);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Error al generar el PDF',
                error: error.message
            });
        }
    }
};

// Creacion de PDF con Puppeteer para exportar turnos
exports.generatePdfWithPuppeteer = async (req, res) => {
    let browser;
    try {
        const html = req.body.html;

        if (!html) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó HTML para generar el PDF'
            });
        }

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        console.log('PDF generado exitosamente');

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=turnos.pdf'
        });

        res.send(pdf);
    } catch (error) {
        console.error('ERROR generando PDF con Puppeteer:', error);
        if (browser) {
            await browser.close();
        }
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Error al generar el PDF',
                error: error.message
            });
        }
    }
};