const { JournalEntry } = require('../models');
const { testConnection } = require('../utils/db');

const journalData = [
    { day: 1, name: "Eve", ref: "Gen 2-4", s: "Created as a powerful help (*ezer*).", w: "Susceptible to deception.", l: "God's commands are restrictive.", t: "God provides exactly what we need when we need it.", q: "What area of my life feels out of alignment because I am trying to sit in the \"driver's seat\"?" },
    { day: 2, name: "Sarah", ref: "Gen 12-21", s: "Faith to move to a strange land.", w: "Impatience leading to \"helping\" God.", l: "God has forgotten His promise.", t: "God is the Promise Maker; His timing is perfect.", q: "What am I holding on to (bitterness or fear) that needs to be surrendered to God’s timing?" },
    { day: 3, name: "Hagar", ref: "Gen 16, 21", s: "Resilience/Endurance.", w: "Contempt/Conflict with authority.", l: "I am forgotten and shunned.", t: "God sees and cares for the forsaken/oppressed.", q: "Where do I sense God’s presence in my life right now, even in a \"desert\" season?" },
    { day: 4, name: "Lot’s Wife", ref: "Gen 19", s: "Protected by grace.", w: "Looking back with attachment to the old life.", l: "My past identity is my only security.", t: "Some things must be left behind to embrace God's future.", q: "What is one thing I am avoiding or refusing to \"leave behind\" today?" },
    { day: 5, name: "Rebekah", ref: "Gen 24-27", s: "Mixture of faithful living.", w: "Personal striving, lies, and deceit.", l: "I must manipulate situations for God’s plan.", t: "Surrender your desires to God's will and timing.", q: "Am I living in surrender, or forcefully trying to make my own desires happen?" },
    { day: 6, name: "Leah", ref: "Gen 29-31", s: "Flourishing as a mother despite being unloved.", w: "Feeling \"weary\" and undervalued.", l: "My value depends on others' love.", t: "God's kindness is woven into the fabric of hard days.", q: "What am I grateful for today that I often overlook in my \"hard days\"?" },
    { day: 7, name: "Rachel", ref: "Gen 29-31", s: "Passionate love.", w: "Consuming jealousy and unfulfilled longing.", l: "Unmet desires define my fulfillment.", t: "God refines our character through trials.", q: "When was the last time I felt truly at peace with where God has me?" },
    { day: 8, name: "Jochebed", ref: "Exodus 2", s: "Courageous hope/Defying earthly edicts.", w: "Desperation in unbearable circumstances.", l: "Earthly edicts are final.", t: "God is greater than all circumstances and has a heart to rescue.", q: "What does “being strong” look like for me today in my current circumstances?" },
    { day: 9, name: "Rahab", ref: "Joshua 2, 6", s: "Bold faith standing alone.", w: "A \"checkered past\".", l: "My past disqualifies me from a holy calling.", t: "God uses broken things to accomplish His purposes.", q: "Where do I need to extend grace to myself regarding my past?" },
    { day: 10, name: "Deborah", ref: "Judges 4-5", s: "Leadership as a prophet/judge.", w: "Heavy responsibility in a male-dominated era.", l: "I am not equipped for this \"battle.\"", t: "God provides strength for those yoked to His will.", q: "What season am I in right now—how can I honor it with the gifts God has given me?" },
    { day: 11, name: "Jael", ref: "Judges 4", s: "Decisive, \"hard\" action.", w: "Vulnerability to immediate danger.", l: "The battle is fought only in the flesh.", t: "Divine power destroys strongholds through the willing.", q: "What is one thing I did this week that required courage—even if no one noticed?" },
    { day: 12, name: "Delilah", ref: "Judges 16", s: "Power of persuasion.", w: "Deceitfulness of presumption and greed.", l: "Temporary gain is worth a lack of integrity.", t: "Wickedness will have its reward.", q: "What habit or mindset do I want to cultivate to replace a desire for control?" },
    { day: 13, name: "Ruth", ref: "Book of Ruth", s: "Loyalty, integrity, and diligence.", w: "Vulnerability as a widow/foreigner.", l: "I am a forgotten outsider.", t: "God is constructing His grand story out of small, everyday stories.", q: "What's one thing I would tell my younger self about God's faithfulness right now?" },
    { day: 14, name: "Naomi", ref: "Book of Ruth", s: "Honesty in grief/Care for family.", w: "Bitterness (\"Mara\") after loss.", l: "The Lord has brought me home empty.", t: "God is a Restorer who uses us to bless the world.", q: "Have I ever felt like God \"raised His fist\" against me—how did He show me grace instead?" },
    { day: 15, name: "Hannah", ref: "1 Sam 1-2", s: "Persistent prayer/Yielded soul.", w: "Deep distress and grief.", l: "God is indifferent to my grief.", t: "God beckons us to continually bring longings before Him in prayer.", q: "What need have I not said out loud that I should bring to God today?" },
    { day: 16, name: "Abigail", ref: "1 Sam 25", s: "Wisdom and prudence.", w: "Challenging marital environment.", l: "My words cannot change a difficult situation.", t: "Well-placed words can save lives and quiet wrath.", q: "How can I use \"sweet speech\" to set a positive tone in my home today?" },
    { day: 17, name: "Jezebel", ref: "1 Kings 18-21", s: "High influence.", w: "Wickedness and idolatry.", l: "I can use my influence for my own selfish ends.", t: "The lust for power yields a wicked harvest.", q: "What area of my influence feels out of alignment with God's Word?" },
    { day: 18, name: "Athaliah", ref: "2 Kings 11", s: "Royal status.", w: "Lust for power and cruelty.", l: "My security is found in earthly power.", t: "Wickedness will always have its reward.", q: "What does \"rest\" look like for me when I stop striving for power or status?" },
    { day: 19, name: "Esther", ref: "Book of Esther", s: "Courage to take risks.", w: "Isolation and early trauma.", l: "My influence is too small for a crisis.", t: "You were placed here for such a time as this.", q: "What does \"being strong\" look like for me today as I face a difficult choice?" },
    { day: 20, name: "Mary (Mother)", ref: "", s: "Yielded faith/Joyous obedience.", w: "Facing the \"impossible\".", l: "I am too lowly for God's purpose.", t: "For with God, nothing will be impossible.", q: "Where do I sense God’s presence calling me to say \"yes\" today?" },
    { day: 21, name: "Elizabeth", ref: "Luke 1", s: "Righteous and blameless faith.", w: "Long-term barrenness/Grief.", l: "It is too late for God's favor in my life.", t: "Rejoice in the Lord who fulfills His promises.", q: "What am I grateful for today that I often overlook while \"waiting\"?" },
    { day: 22, name: "Anna", ref: "Luke 2", s: "Faithful waiting/Prayer.", w: "Long-term widowhood.", l: "My silent waiting is useless.", t: "Faithful waiting results in seeing the Promise fulfilled.", q: "What season am I in right now—and how can I honor it?" },
    { day: 23, name: "Samaritan Woman", ref: "", s: "Immediate evangelist.", w: "Social outcast/Reputation.", l: "My past reputation defines my value.", t: "An encounter with Jesus transforms your life forever.", q: "What lie have I believed about my worth that I need to release?" },
    { day: 24, name: "Martha", ref: "Luke 10", s: "Industrious service.", w: "Distracted and anxious.", l: "Busyness is proof of my devotion.", t: "The \"better place\" is sitting at Jesus' feet.", q: "What does “rest” look like for me—and how can I create more of it today?" },
    { day: 25, name: "Mary of Bethany", ref: "", s: "Risky acts of love.", w: "Misunderstood by others.", l: "Devotion should be sensible and moderate.", t: "Deep devotion witnesses to the power of the resurrection.", q: "What am I holding on to (time or treasure) that no longer serves God's purpose?" },
    { day: 26, name: "Mary Magdalene", ref: "", s: "Loyalty to Jesus/Encountering God.", w: "Past suffering/Brokenness.", l: "My brokenness limits my purpose.", t: "God can restore us for His purpose.", q: "Where do I need to extend grace to myself or someone else today?" },
    { day: 27, name: "Dorcas", ref: "Acts 9", s: "Industry and kindness.", w: "Finite time/Health.", l: "Small acts of service are insignificant.", t: "Good works are a lasting legacy for the church.", q: "What is one thing I did this week that I'm proud of, no matter how small?" },
    { day: 28, name: "Lydia", ref: "Acts 16", s: "Openness, confidence, and hospitality.", w: "Wealth as a potential status trap.", l: "My success is for my own status and security.", t: "Resources are avenues for God's great love.", q: "How can my work and material benefits be a source of blessing to others this week?" },
    { day: 29, name: "Priscilla", ref: "Acts 18", s: "Training others in Truth.", w: "Working in a \"secondary\" role.", l: "My role as a \"helper\" is less significant.", t: "Using your gifts profits the whole Body of Christ.", q: "What habit or mindset do I want to cultivate to support who I am becoming in Christ?" },
    { day: 30, name: "Sapphira", ref: "Acts 5", s: "Involved in the early church.", w: "Dishonesty and pretense.", l: "I can lie to look more \"holy\" than I am.", t: "God values a pliable heart over outward pretense.", q: "What's one thing I'm avoiding telling God or myself? Why?" },
];

async function seedJournals() {
    try {
        await testConnection();
        console.log('Syncing JournalEntry model...');
        // Alter table to add columns if they don't exist by syncing
        // (In production, usually we rely on migration scripts, but sync({ alter: true }) is safe enough for adding unconstrained columns)
        await JournalEntry.sync({ alter: true });

        console.log('Seeding 30 Days of Journal Entries...');

        for (const data of journalData) {
            const entryData = {
                day_number: data.day,
                title: data.name,
                subtitle: `The Story of ${data.name}`,
                biblical_ref: data.ref,
                encounter_text: `Encountering ${data.name} in ${data.ref || 'Scripture'}`,
                strengths: data.s,
                weaknesses: data.w,
                lie_text: data.l,
                truth_text: data.t,
                reflective_question: data.q,
                modern_contrast: `How the story of ${data.name} speaks to us today.`,
                redemption_text: `A moment of redemption and grace for ${data.name}.`,
                is_free: true,
                // Using high-quality Unsplash African Fashion placeholders
                image_url: `https://images.unsplash.com/photo-${[
                    '1531384441138-2736e62e0919', // Modern African Woman
                    '1523910088395-d7457f920f78', // Luxury texture
                    '1493655161922-ef98929de9d8', // Editorial
                    '1485333348825-414870c43658', // Fashion
                    '1490481651871-ab68ff25d43d', // Style
                ][data.day % 5]}?q=80&w=1080&auto=format&fit=crop`
            };

            const [entry, created] = await JournalEntry.upsert(entryData, {
                returning: true,
                conflictFields: ['day_number']
            });
            console.log(`${created ? 'Created' : 'Updated'} Day ${data.day}: ${data.name}`);
        }

        console.log('✅ Journal seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding journal:', error);
        process.exit(1);
    }
}

seedJournals();
