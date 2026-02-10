const { JournalEntry, JournalResponse, Product, ProductImage } = require('../models');

const getAllEntries = async (req, res) => {
    try {
        const entries = await JournalEntry.findAll({
            include: [{ model: Product, as: 'garment', include: [{ model: ProductImage, as: 'images' }] }]
        });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching journal entries' });
    }
};

const getEntryById = async (req, res) => {
    try {
        const entry = await JournalEntry.findByPk(req.params.id, {
            include: [{ model: Product, as: 'garment', include: [{ model: ProductImage, as: 'images' }] }]
        });
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching entry' });
    }
};

const saveReflection = async (req, res) => {
    try {
        console.log('Saving reflection for user:', req.user.id); // Debug
        console.log('Payload:', req.body); // Debug

        const { entry_id, reflection_text } = req.body;

        if (!entry_id || !reflection_text) {
            console.error('Missing fields');
            return res.status(400).json({ message: 'Missing entry_id or reflection_text' });
        }

        const response = await JournalResponse.create({
            user_id: req.user.id,
            entry_id,
            reflection_text
        });

        console.log('Reflection saved ID:', response.id); // Debug
        res.status(201).json(response);
    } catch (error) {
        console.error('Error saving reflection:', error);
        res.status(400).json({ message: 'Error saving reflection' });
    }
};

const getMyReflections = async (req, res) => {
    try {
        const reflections = await JournalResponse.findAll({
            where: { user_id: req.user.id },
            include: [{ model: JournalEntry, as: 'entry' }]
        });
        res.json(reflections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reflections' });
    }
};

const PDFDocument = require('pdfkit');
const { User } = require('../models');

// ... existing code ...

const getAllReflections = async (req, res) => {
    try {
        const reflections = await JournalResponse.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: JournalEntry, as: 'entry', attributes: ['title', 'encounter_text'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reflections);
    } catch (error) {
        console.error('Error fetching all reflections:', error);
        res.status(500).json({ message: 'Error fetching reflections' });
    }
};

const generateReflectionPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const reflection = await JournalResponse.findByPk(id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: JournalEntry, as: 'entry' }
            ]
        });

        if (!reflection) return res.status(404).json({ message: 'Reflection not found' });

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reflection-${id}.pdf`);

        doc.pipe(res);

        // --- PDF Design: African Luxury / Sanctified ---

        // Header
        doc.font('Times-Roman').fontSize(24).text('TWOSTONES', { align: 'center', characterSpacing: 5 });
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(8).text('SACRED REFLECTIONS', { align: 'center', characterSpacing: 3 });
        doc.moveDown(2);

        // Divider
        doc.moveTo(200, doc.y).lineTo(400, doc.y).strokeColor('#c5a059').lineWidth(1).stroke().moveDown(2).strokeColor('black');

        // Title
        doc.font('Times-Bold').fontSize(18).text(reflection.entry.title.toUpperCase(), { align: 'center' });
        doc.moveDown(1);

        // User Info
        doc.font('Helvetica-Oblique').fontSize(10).fillColor('#666666').text(`Reflected by ${reflection.User.name} on ${new Date(reflection.createdAt).toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(3);

        // Encounter Text (Context)
        doc.rect(50, doc.y, 500, 80).fillOpacity(0.05).fill('#000000').fillOpacity(1);
        doc.moveUp(4); // Move back up to write text over rect

        doc.fillColor('#000000').font('Times-Italic').fontSize(12).text(`"${reflection.entry.encounter_text}"`, 70, doc.y + 20, { width: 460, align: 'center', lineGap: 5 });
        doc.moveDown(4);

        // The Reflection (User Input)
        doc.font('Helvetica-Bold').fontSize(10).text('YOUR TRUTH', { align: 'center', characterSpacing: 2 });
        doc.moveDown(1);
        doc.font('Times-Roman').fontSize(14).text(reflection.reflection_text, { align: 'justify', lineGap: 6 });

        // Footer
        doc.page.margins.bottom = 0;
        doc.text('', 50, 750); // Move to bottom
        doc.font('Helvetica').fontSize(8).fillColor('#999999').text('Identity. Faith. Fashion.', { align: 'center', characterSpacing: 2 });

        doc.end();

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
};

module.exports = { getAllEntries, getEntryById, saveReflection, getMyReflections, getAllReflections, generateReflectionPDF };
