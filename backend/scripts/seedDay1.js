const { sequelize } = require('../src/utils/db');
const { JournalEntry } = require('../src/models');

const seedDay1 = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync to ensure table has new columns (use with caution in prod, but okay for dev here)
        await sequelize.sync({ alter: true });

        const day1 = {
            day_number: 1,
            title: 'Eve: The Mother of All Living',
            encounter_text: 'Now the serpent was more crafty than any of the wild animals the Lord God had made. He said to the woman, “Did God really say, ‘You must not eat from any tree in the garden’?”',
            strengths: 'She was the first woman, created directly by God uniquely to be a partner and helper. She had no childhood baggage, no trauma, and walked with God in the cool of the day.',
            weaknesses: 'She engaged with the lie instead of silencing it. She desired wisdom on her own terms rather than trusting God’s definition of good and evil.',
            modern_contrast: 'We too are constantly bombarded with the message that "we are enough" on our own, or that God’s boundaries are restrictive rather than protective. We crave autonomy over intimacy.',
            identity_text: 'You are Ezer Kenegdo - a "helper suitable". Not a subordinate, but a warrior-partner designed to rescue and reflect God\'s image.',
            lie_text: 'God is holding out on me. If I follow His layout, I will miss out on life/knowledge/happiness.',
            truth_text: 'God’s boundaries are the perimeter of His protection and the garden of my flourishing.',
            consequence_text: 'Shame entered. They hid. The relationship was broken. The pain of childbirth and the struggle for power in marriage began.',
            redemption_text: 'And I will put enmity between you and the woman... He will crush your head, and you will strike his heel. (Genesis 3:15) - The first promise of the Savior.',
            is_free: true
        };

        const [entry, created] = await JournalEntry.findOrCreate({
            where: { day_number: 1 },
            defaults: day1
        });

        if (!created) {
            await entry.update(day1);
            console.log('Day 1 Updated.');
        } else {
            console.log('Day 1 Created.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDay1();
