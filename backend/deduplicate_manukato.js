const { ManukatoItem } = require('./src/models');
const { sequelize } = require('./src/utils/db');

async function deduplicate() {
    try {
        console.log('--- DEDUPLICATION START ---');

        // Find all duplicate originalNames
        const [duplicates] = await sequelize.query(`
            SELECT originalName, COUNT(*) as count 
            FROM ManukatoItems 
            GROUP BY originalName 
            HAVING count > 1
        `);

        console.log(`Found ${duplicates.length} duplicate filenames.`);

        for (const duplicate of duplicates) {
            const { originalName } = duplicate;
            console.log(`Fixing duplicates for: ${originalName}`);

            // Keep only the item with the smallest ID
            const items = await ManukatoItem.findAll({
                where: { originalName },
                order: [['id', 'ASC']]
            });

            const idsToDelete = items.slice(1).map(item => item.id);
            await ManukatoItem.destroy({
                where: { id: idsToDelete }
            });
            console.log(`✅ Kept ID ${items[0].id}, deleted IDs: ${idsToDelete.join(', ')}`);
        }

        console.log('--- DEDUPLICATION COMPLETE ---');
    } catch (error) {
        console.error('❌ DEDUPLICATION FAILED:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

deduplicate();
