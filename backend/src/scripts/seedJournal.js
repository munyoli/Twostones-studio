const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { JournalEntry } = require('../models');
const { testConnection } = require('../utils/db');

const journalData = [
    {
        day: 1, name: "Eve", ref: "Gen 2-4", s: "Created as a powerful help (*ezer*).", w: "Susceptible to deception.", l: "God's commands are restrictive.", t: "God provides exactly what we need when we need it.", q: "What area of my life feels out of alignment because I am trying to sit in the \"driver's seat\"?",
        mirror: "Eve’s desire for the 'more' that God had withheld is mirrored in our own striving for control and the underlying fear that His provision is not enough.",
        encounter: "We meet the first woman, not just as a figure of the fall, but as the first to carry the image of God into a world of choice.",
        redemption: "The first promised sprout of hope (Gen 3:15)—that despite her fall, her seed would eventually crush the head of the serpent."
    },
    {
        day: 2, name: "Sarah", ref: "Gen 12-21", s: "Faith to move to a strange land.", w: "Impatience leading to \"helping\" God.", l: "God has forgotten His promise.", t: "God is the Promise Maker; His timing is perfect.", q: "What am I holding on to (bitterness or fear) that needs to be surrendered to God’s timing?",
        mirror: "Sarah’s laughter in the face of an 'impossible' promise reveals the tension we all feel between God’s timing and our human limitations.",
        encounter: "The mother of nations, who walked from an idol-filled city to a land of promise, learning that God's power is not bound by age or logic.",
        redemption: "The miracle of a new name and a new season, proving that nothing is too hard for the Lord, even in the \"deadness\" of old age."
    },
    {
        day: 3, name: "Hagar", ref: "Gen 16, 21", s: "Resilience/Endurance.", w: "Contempt/Conflict with authority.", l: "I am forgotten and shunned.", t: "God sees and cares for the forsaken/oppressed.", q: "Where do I sense God’s presence in my life right now, even in a \"desert\" season?",
        mirror: "Hagar’s story reminds us that even when we are cast out or overlooked by society, we are never unseen by the God who pursues.",
        encounter: "An Egyptian maidservant who became the first person in Scripture to name God: El Roi—the God who sees me.",
        redemption: "The redemptive truth that God is the Seer of the unseen, turning an Egyptian outcast into a mother of a great multitude."
    },
    {
        day: 4, name: "Lot’s Wife", ref: "Gen 19", s: "Protected by grace.", w: "Looking back with attachment to the old life.", l: "My past identity is my only security.", t: "Some things must be left behind to embrace God's future.", q: "What is one thing I am avoiding or refusing to \"leave behind\" today?",
        mirror: "The lure of a familiar past can often blind us to the freedom of the future God is calling us into; some things are meant to be left behind.",
        encounter: "A woman standing between a world of judgment and a path of rescue, reminding us that where our gaze lingers, our heart eventually stays.",
        redemption: "A sobering reminder that redemption requires a whole heart, not a divided gaze between the old life and the new rescue."
    },
    {
        day: 5, name: "Rebekah", ref: "Gen 24-27", s: "Mixture of faithful living.", w: "Personal striving, lies, and deceit.", l: "I must manipulate situations for God’s plan.", t: "Surrender your desires to God's will and timing.", q: "Am I living in surrender, or forcefully trying to make my own desires happen?",
        mirror: "Rebekah’s manipulation of her family’s destiny is a mirror to the ways we try to 'help' God fulfill His promises through our own cleverness.",
        encounter: "The bride chosen by God, who began her journey with water for camels and ended it with the weight of choosing between her sons.",
        redemption: "God's sovereignty over-ruling human schemes, ensuring the line of promise continues through Grace, not just through tradition."
    },
    {
        day: 6, name: "Leah", ref: "Gen 29-31", s: "Flourishing as a mother despite being unloved.", w: "Feeling \"weary\" and undervalued.", l: "My value depends on others' love.", t: "God's kindness is woven into the fabric of hard days.", q: "What am I grateful for today that I often overlook in my \"hard days\"?",
        mirror: "Leah’s search for value in her husband’s love is a reflection of the universal longing to be seen, known, and cherished for who we are.",
        encounter: "The unloved sister whose eyes were tender, yet in her rejection, God placed her at the root of the lineage of the King of Kings.",
        redemption: "The redemption of the unloved, as God chooses the weak things of the world to bring forth the Lion of the tribe of Judah."
    },
    {
        day: 7, name: "Rachel", ref: "Gen 29-31", s: "Passionate love.", w: "Consuming jealousy and unfulfilled longing.", l: "Unmet desires define my fulfillment.", t: "God refines our character through trials.", q: "When was the last time I felt truly at peace with where God has me?",
        mirror: "Rachel’s consuming jealousy highlights the danger of letting unmet desires define our fulfillment and rob us of the peace God offers.",
        encounter: "The beloved shepherdess who found that even the deepest romantic love cannot quiet the soul's desperate ache for fulfillment.",
        redemption: "The refinement of a soul through longing, learning that true fulfillment is found in the Giver, not just the gifts."
    },
    {
        day: 8, name: "Jochebed", ref: "Exodus 2", s: "Courageous hope/Defying earthly edicts.", w: "Desperation in unbearable circumstances.", l: "Earthly edicts are final.", t: "God is greater than all circumstances and has a heart to rescue.", q: "What does “being strong” look like for me today in my current circumstances?",
        mirror: "Jochebed’s courageous act of letting go is a mirror to the radical trust required to place what we love most into God’s sovereign hands.",
        encounter: "The Hebrew mother who turned a basket of reeds into a vessel of destiny, trusting the river for what she knew her hands could no longer hold.",
        redemption: "The redemption of a mother's sacrifice, where a basket on a river becomes the throne-room preparation for a nation's deliverer."
    },
    {
        day: 9, name: "Rahab", ref: "Joshua 2, 6", s: "Bold faith standing alone.", w: "A \"checkered past\".", l: "My past disqualifies me from a holy calling.", t: "God uses broken things to accomplish His purposes.", q: "Where do I need to extend grace to myself regarding my past?",
        mirror: "Rahab’s bold faith—standing alone against her own culture—reflects the courage required to embrace a new identity in Christ.",
        encounter: "An outsider in Jericho who saw the hand of the Almighty moving across the desert and chose to side with the God of Heaven.",
        redemption: "The radical inclusion of the outsider, as a scarlet cord transforms a harlot into a direct ancestor of the Savior."
    },
    {
        day: 10, name: "Deborah", ref: "Judges 4-5", s: "Leadership as a prophet/judge.", w: "Heavy responsibility in a male-dominated era.", l: "I am not equipped for this \"battle.\"", t: "God provides strength for those yoked to His will.", q: "What season am I in right now—how can I honor it with the gifts God has given me?",
        mirror: "Deborah’s leadership in a time of crisis is a mirror to the strength God provides when we are willing to be yoked to His will for others.",
        encounter: "The prophetess who sat under the palm tree, judging Israel with wisdom and leading an army when the leaders of the land faltered.",
        redemption: "The redemption of leadership, as God empowers a mother in Israel to arise and bring forty years of peace to a fractured land."
    },
    {
        day: 11, name: "Jael", ref: "Judges 4", s: "Decisive, \"hard\" action.", w: "Vulnerability to immediate danger.", l: "The battle is fought only in the flesh.", t: "Divine power destroys strongholds through the willing.", q: "What is one thing I did this week that required courage—even if no one noticed?",
        mirror: "Jael’s decisive action in her own domestic space shows that God often uses the available and the willing to accomplish the heavy work of His kingdom.",
        encounter: "A tent-dwelling woman who proved that victory is not always won on the battlefield, but often in the quiet, decisive moment of hospitality.",
        redemption: "The unexpected victory of the ordinary, as a domestic tool becomes the instrument of ultimate judgment against the oppressor."
    },
    {
        day: 12, name: "Delilah", ref: "Judges 16", s: "Power of persuasion.", w: "Deceitfulness of presumption and greed.", l: "Temporary gain is worth a lack of integrity.", t: "Wickedness will have its reward.", q: "What habit or mindset do I want to cultivate to replace a desire for control?",
        mirror: "Delilah’s misuse of her influence and beauty mirrors the temptation to prioritize temporary gain over the integrity of our soul.",
        encounter: "The woman from the Valley of Sorek, whose words were smoother than oil but whose heart was anchored to the shifting sands of greed.",
        redemption: "A cautionary redemption of influence, reminding us that beauty and charm without integrity lead to the destruction of the soul."
    },
    {
        day: 13, name: "Ruth", ref: "Book of Ruth", s: "Loyalty, integrity, and diligence.", w: "Vulnerability as a widow/foreigner.", l: "I am a forgotten outsider.", t: "God is constructing His grand story out of small, everyday stories.", q: "What's one thing I would tell my younger self about God's faithfulness right now?",
        mirror: "Ruth’s quiet diligence and loyalty show that God is often constructing His grandest stories out of our small, everyday acts of faithfulness.",
        encounter: "The Moabite widow who turned her back on her gods and found that a field of barley can be the stage for a story of eternal redemption.",
        redemption: "The Kinsman-Redeemer’s favor, turning a Moabitess’s loyal 'where you go, I will go' into a place in the genealogy of Jesus."
    },
    {
        day: 14, name: "Naomi", ref: "Book of Ruth", s: "Honesty in grief/Care for family.", w: "Bitterness (\"Mara\") after loss.", l: "The Lord has brought me home empty.", t: "God is a Restorer who uses us to bless the world.", q: "Have I ever felt like God \"raised His fist\" against me—how did He show me grace instead?",
        mirror: "Naomi’s journey from bitterness ('Mara') to restoration is a reflection of God’s power to use even our deepest losses to bring about a blessed legacy.",
        encounter: "A woman who went out full and came home empty, only to find that God’s definition of restoration is far wider than our eyes can see.",
        redemption: "The restoration of the empty house, where God turns 'Mara' (bitterness) into the joy of a grandson who restores her life."
    },
    {
        day: 15, name: "Hannah", ref: "1 Sam 1-2", s: "Persistent prayer/Yielded soul.", w: "Deep distress and grief.", l: "God is indifferent to my grief.", t: "God beckons us to continually bring longings before Him in prayer.", q: "What need have I not said out loud that I should bring to God today?",
        mirror: "Hannah’s persistent prayer despite deep grief reflects the invitation to continually bring our rawest longings before the God who hears.",
        encounter: "A woman of sorrow who poured out her soul at the tabernacle, trading her deep distress for a song of praise that echoed through the generations.",
        redemption: "The redemption of the barren heart, as a prayer in the temple becomes a prophetic song for the King of Kings."
    },
    {
        day: 16, name: "Abigail", ref: "1 Sam 25", s: "Wisdom and prudence.", w: "Challenging marital environment.", l: "My words cannot change a difficult situation.", t: "Well-placed words can save lives and quiet wrath.", q: "How can I use \"sweet speech\" to set a positive tone in my home today?",
        mirror: "Abigail’s wisdom and 'sweet speech' in a volatile environment mirror the power we have to set a tone of peace and protection in our own circles.",
        encounter: "The wife of a Fool, who possessed the presence of mind to intercept a King’s wrath and the beauty of character that won a kingdom.",
        redemption: "The wisdom that averts disaster, as a woman of 'good understanding' stays the hand of a King and preserves a righteous line."
    },
    {
        day: 17, name: "Jezebel", ref: "1 Kings 18-21", s: "High influence.", w: "Wickedness and idolatry.", l: "I can use my influence for my own selfish ends.", t: "The lust for power yields a wicked harvest.", q: "What area of my influence feels out of alignment with God's Word?",
        mirror: "Jezebel’s lust for power and control is a mirror to the destructive nature of using our influence for selfish and idolatrous ends.",
        encounter: "A Phoenician princess who brought the shadows of Baal into the palace of Israel, attempting to silence the voice of the true God.",
        redemption: "The finality of divine justice, proving that no amount of worldly power or manipulation can withstand the truth of God’s Word."
    },
    {
        day: 18, name: "Athaliah", ref: "2 Kings 11", s: "Royal status.", w: "Lust for power and cruelty.", l: "My security is found in earthly power.", t: "Wickedness will always have its reward.", q: "What does \"rest\" look like for me when I stop striving for power or status?",
        mirror: "Athaliah’s ruthless pursuit of the throne reflects the emptiness of seeking security in earthly power at the expense of our soul and legacy.",
        encounter: "The daughter of Jezebel who sought to eradicate the royal line, only to be confronted by the quiet survival of a single promised seed.",
        redemption: "The failure of the usurper, as God preserves a single royal seed (Joash) to keep the eternal promise to the house of David."
    },
    {
        day: 19, name: "Esther", ref: "Book of Esther", s: "Courage to take risks.", w: "Isolation and early trauma.", l: "My influence is too small for a crisis.", t: "You were placed here for such a time as this.", q: "What does \"being strong\" look like for me today as I face a difficult choice?",
        mirror: "Esther’s realization that she was placed 'for such a time as this' mirrors the divine purpose woven into the specific circumstances of our own lives.",
        encounter: "An orphan girl who became a Queen, walking into the King’s inner court with a simple, terrifying resolve: If I perish, I perish.",
        redemption: "The redemption of an orphan’s destiny, as 'such a time as this' transforms a hidden identity into the salvation of a people."
    },
    {
        day: 20, name: "Mary (Mother)", ref: "Luke 1-2", s: "Yielded faith/Joyous obedience.", w: "Facing the \"impossible\".", l: "I am too lowly for God's purpose.", t: "For with God, nothing will be impossible.", q: "Where do I sense God’s presence calling me to say \"yes\" today?",
        mirror: "Mary’s yielded 'yes' to the impossible is a mirror to the radical faith required to believe that nothing is beyond God’s power to accomplish through us.",
        encounter: "A young girl from Nazareth whose heartbeat became the first music the Savior of the world ever heard, yielding her entire life to a holy mystery.",
        redemption: "The ultimate 'Yes' to Grace, as a humble girl from Nazareth becomes the vessel for the Incarnation of the Word."
    },
    {
        day: 21, name: "Elizabeth", ref: "Luke 1", s: "Righteous and blameless faith.", w: "Long-term barrenness/Grief.", l: "It is too late for God's favor in my life.", t: "Rejoice in the Lord who fulfills His promises.", q: "What am I grateful for today that I often overlook while \"waiting\"?",
        mirror: "Elizabeth’s joy in another’s blessing after a long season of barrenness is a reflection of the grace to celebrate God’s timing in another's life.",
        encounter: "A daughter of Aaron who walked in righteousness for decades, only to hear the song of God’s favor after the world had long since gone quiet.",
        redemption: "The vindication of the faithful, where a lifetime of righteous waiting culminates in the birth of the herald of Christ."
    },
    {
        day: 22, name: "Anna", ref: "Luke 2", s: "Faithful waiting/Prayer.", w: "Long-term widowhood.", l: "My silent waiting is useless.", t: "Faithful waiting results in seeing the Promise fulfilled.", q: "What season am I in right now—and how can I honor it?",
        mirror: "Anna’s decades of faithful waiting in the temple mirror the spiritual depth found in the quiet, consistent rhythms of prayer and devotion.",
        encounter: "A prophetess who lived in the presence of God for eighty-four years, waiting until her aged eyes could finally behold the consolation of Israel.",
        redemption: "The reward of the persistent worshipper, whose eighty-four years of prayer are crowned by seeing the Face of the Savior."
    },
    {
        day: 23, name: "Samaritan Woman", ref: "John 4", s: "Immediate evangelist.", w: "Social outcast/Reputation.", l: "My past reputation defines my value.", t: "An encounter with Jesus transforms your life forever.", q: "What lie have I believed about my worth that I need to release?",
        mirror: "The Samaritan woman’s encounter at the well reflects the transformative power of being fully known by Jesus and yet fully and radically loved.",
        encounter: "A woman who came for physical water at noon to avoid the crowds, but left a jar behind because she had finally tasted the Living Water.",
        redemption: "The fountain of Living Water, where the disclosure of a messy past becomes the catalyst for an entire city’s salvation."
    },
    {
        day: 24, name: "Martha", ref: "Luke 10", s: "Industrious service.", w: "Distracted and anxious.", l: "Busyness is proof of my devotion.", t: "The \"better place\" is sitting at Jesus' feet.", q: "What does “rest” look like for me—and how can I create more of it today?",
        mirror: "Martha’s distraction and anxiety in her service mirror the modern struggle to prioritize the 'better part'—the simple posture of sitting at the feet of Jesus.",
        encounter: "The sister from Bethany, whose hospitality was vibrant and busy, yet who learned that the ultimate service starts in the presence of the Master.",
        redemption: "The redemption of the distracted servant, as Jesus gently calls her back to the 'one thing' that is truly necessary."
    },
    {
        day: 25, name: "Mary of Bethany", ref: "Luke 10, John 12", s: "Risky acts of love.", w: "Misunderstood by others.", l: "Devotion should be sensible and moderate.", t: "Deep devotion witnesses to the power of the resurrection.", q: "What am I holding on to (time or treasure) that no longer serves God's purpose?",
        mirror: "Mary’s 'wasteful' act of devotion is a mirror to the deep, risky love that recognizes the supreme value of Jesus above every earthly treasure.",
        encounter: "A woman whose silence was her strength and whose nard was her sacrifice, anointing the King for a burial that would conquer the grave.",
        redemption: "The extravagance of worship, where a broken alabaster jar and 'wasteful' love prepare the King for His burial."
    },
    {
        day: 26, name: "Mary Magdalene", ref: "Luke 8, John 20", s: "Loyalty to Jesus/Encountering God.", w: "Past suffering/Brokenness.", l: "My brokenness limits my purpose.", t: "God can restore us for His purpose.", q: "Where do I need to extend grace to myself or someone else today?",
        mirror: "Mary Magdalene’s loyalty to Jesus from the cross to the garden reflects the profound transformation of a heart rescued and restored for a holy purpose.",
        encounter: "The first witness of the resurrection, who stood in the darkness of the garden and heard the Gardener call her by name: Miriam.",
        redemption: "The restoration of the rescued soul, from a past of demons to being the first to announce the Resurrection."
    },
    {
        day: 27, name: "Dorcas", ref: "Acts 9", s: "Industry and kindness.", w: "Finite time/Health.", l: "Small acts of service are insignificant.", t: "Good works are a lasting legacy for the church.", q: "What is one thing I did this week that I'm proud of, no matter how small?",
        mirror: "Dorcas’s simple acts of service with her needle and thread mirror the lasting legacy of kindness that can be built through our everyday hands.",
        encounter: "A disciple in Joppa, full of good works, whose garments for the poor were so beloved that the early church could not bear to let her go.",
        redemption: "The legacy of the generous hand, as simple garments for the poor become a display of God's power over life and death."
    },
    {
        day: 28, name: "Lydia", ref: "Acts 16", s: "Openness, confidence, and hospitality.", w: "Wealth as a potential status trap.", l: "My success is for my own status and security.", t: "Resources are avenues for God's great love.", q: "How can my work and material benefits be a source of blessing to others this week?",
        mirror: "Lydia’s hospitality and business success reflect how our professional resources and influence can become powerful avenues for the expansion of Grace.",
        encounter: "A seller of purple from Thyatira, whose heart God opened by the river, turning her home and her business into a sanctuary for the early church.",
        redemption: "The sanctification of success, where a business of purple cloth becomes the foundation for the First Church in Europe."
    },
    {
        day: 29, name: "Priscilla", ref: "Acts 18", s: "Training others in Truth.", w: "Working in a \"secondary\" role.", l: "My role as a \"helper\" is less significant.", t: "Using your gifts profits the whole Body of Christ.", q: "What habit or mindset do I want to cultivate to support who I am becoming in Christ?",
        mirror: "Priscilla’s partnership in ministry and instruction mirrors the value of using our intellectual and spiritual gifts in collaboration for the building up of others.",
        encounter: "The tent-maker and teacher who worked alongside apostles, proving that the deepest truths of the faith are best shared through the hospitality of an open life.",
        redemption: "The partnership of the gospel, where an open home and a clear mind help shape the theology of the early church."
    },
    {
        day: 30, name: "Sapphira", ref: "Acts 5", s: "Involved in the early church.", w: "Dishonesty and pretense.", l: "I can lie to look more \"holy\" than I am.", t: "God values a pliable heart over outward pretense.", q: "What's one thing I'm avoiding or failing to tell God?",
        mirror: "Sapphira’s attempt to look more 'holy' than she was is a mirror to the danger of prioritizing our outward image over the integrity of our honest heart.",
        encounter: "A woman who saw the generosity of the first believers and chose to hide behind a mask of participation, forgetting that God looks directly at the soul.",
        redemption: "The holiness of the honest heart, reminding the church that true partnership with God is built on truth, not pretense."
    }
];

async function seedJournals() {
    try {
        await testConnection();
        console.log('Syncing JournalEntry model...');
        // Alter table to add columns if they don't exist by syncing
        // (In production, usually we rely on migration scripts, but sync({ alter: true }) is safe enough for adding unconstrained columns)
        await JournalEntry.sync({ alter: true });

        console.log('Seeding 30 Days of Detailed Journal Entries with Modern Mirror...');

        const customImages = {
            1: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day1_eve.png",
            2: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day2_sarah.png",
            3: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day3_hagar.png",
            4: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day4_lots_wife.png",
            5: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day5_rebekah.png",
            6: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day6_leah.png",
            7: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day7_rachel.png",
            8: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day8_jochebed.png",
            9: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day9_rahab.png",
            10: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day10_deborah.png",
            11: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day11_jael.png",
            12: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day12_delilah.png",
            13: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day13_ruth.png",
            14: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day14_naomi.png",
            15: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day15_hannah.png",
            16: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day16_abigail.png",
            17: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day17_jezebel.png",
            18: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day18_athaliah.png",
            19: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day19_esther.png",
            20: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day20_mary.png",
            21: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day21_elizabeth.png",
            22: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day22_anna.png",
            23: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day23_samaritan_woman.png",
            24: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day24_martha.png",
            25: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day25_mary_of_bethany.png",
            26: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day26_mary_magdalene.png",
            27: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day27_dorcas.png",
            28: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day28_lydia.png",
            29: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day29_priscilla.png",
            30: "https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/journal/day30_sapphira.png"
        };

        for (const data of journalData) {

            // Use custom image if available, otherwise fallback to Unsplash placeholders
            const imageFallback = `https://images.unsplash.com/photo-${[
                '1531384441138-2736e62e0919',
                '1589134140411-bd7c9c3a28fc',
                '1492633423570-761f143c62cf',
                '1605333396515-30ad543b573e',
                '1496220141821-61539bbac635',
                '1501644891228-250c4cefa717',
                '1515886657613-9af3515eaaf6',
                '1529139513092-e845d3599b0c',
                '1485231183942-834f37435f30',
                '1541014175782-9626b47c043e',
                '1516766151441-fe3913fdded5',
                '1607513527334-789f30e06708'
            ][data.day % 12]}?q=80&w=1080&auto=format&fit=crop`;

            const entryData = {
                day_number: data.day,
                title: data.name,
                subtitle: `Day ${data.day}: The Story of ${data.name}`,
                biblical_ref: data.ref,
                encounter_text: data.encounter,
                strengths: data.s,
                weaknesses: data.w,
                lie_text: data.l,
                truth_text: data.t,
                reflective_question: data.q,
                modern_contrast: data.mirror, // This is the Mirror content
                redemption_text: data.redemption,
                is_free: true,
                image_url: customImages[data.day] || imageFallback
            };

            const [entry, created] = await JournalEntry.upsert(entryData, {
                returning: true,
                conflictFields: ['day_number']
            });
            console.log(`${created ? 'Created' : 'Updated'} Day ${data.day}: ${data.name} (with Mirror)`);
        }

        console.log('✅ Detailed Journal seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding detailed journal:', error);
        process.exit(1);
    }
}

seedJournals();
