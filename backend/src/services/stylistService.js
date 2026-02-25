const { ManukatoItem } = require('../models');
const { Op } = require('sequelize');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze a user's photo using Gemini Vision to determine body type and skin undertone.
 * @param {Buffer} imageBuffer - The image file buffer
 * @param {string} mimeType - The image MIME type (e.g., 'image/jpeg')
 * @returns {Promise<Object>} - { bodyType, undertone, styleNotes }
 */
const analyzePhoto = async (imageBuffer, mimeType) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imagePart = {
        inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType
        }
    };

    const prompt = `You are an expert fashion stylist and body image consultant for a luxury African fashion house called "Twostones."
    
Analyze this photo of a person and provide:
1. **Body Type**: Classify as one of: Hourglass, Pear, Apple, Rectangle, or Inverted Triangle. If unsure, make your best assessment.
2. **Skin Undertone**: Classify as: Warm, Cool, or Neutral. Look at skin tone warmth/coolness.
3. **Style Notes**: 2-3 sentences about what you observe about their current style, posture, and proportions.

Respond ONLY in this exact JSON format, no markdown, no extra text:
{"bodyType": "...", "undertone": "...", "styleNotes": "..."}`;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();

    // Parse JSON from response (handle potential markdown wrapping)
    let parsed;
    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (e) {
        console.error('[AI Stylist] Failed to parse Gemini response:', responseText);
        parsed = { bodyType: 'Rectangle', undertone: 'Neutral', styleNotes: 'Unable to fully analyze the photo. Using balanced defaults.' };
    }

    return parsed;
};

/**
 * Core recommendation engine: combines AI analysis with product matching.
 */
const getRecommendation = async (data) => {
    console.log("getRecommendation called with:", JSON.stringify(data));
    const { bodyType, undertone, occasion } = data;

    // 1. Rules Engine: Define Advice & Keywords
    let silhouetteKeywords = [];
    let silhouetteAdvice = "";
    let avoidAdvice = "";

    switch (bodyType?.toLowerCase()) {
        case 'hourglass':
            silhouetteAdvice = "Focus on tailored cuts that highlight your waist. Wrap dresses, peplum tops, and belted jackets celebrate your balanced proportions.";
            avoidAdvice = "Avoid boxy, shapeless silhouettes that hide your natural curves.";
            silhouetteKeywords = ['belted', 'wrap', 'waist', 'fitted', 'tailored', 'peplum'];
            break;
        case 'pear':
            silhouetteAdvice = "Opt for A-line skirts and wide-leg trousers to flow gracefully over hips, paired with structured tops to draw the eye upward.";
            avoidAdvice = "Avoid tight-fitting bottoms and excessive volume below the waist.";
            silhouetteKeywords = ['a-line', 'wide-leg', 'flow', 'skirt', 'waist', 'structured'];
            break;
        case 'apple':
            silhouetteAdvice = "Create elongation with empire waists, flowy tunics, and deep V-necklines. Let fabric drape rather than cling.";
            avoidAdvice = "Avoid clinging fabrics around the midsection and overly tight belts.";
            silhouetteKeywords = ['empire', 'tunic', 'loose', 'flowy', 'kaftan', 'v-neck'];
            break;
        case 'rectangle':
            silhouetteAdvice = "Create curves with intention. Use belts to define a waist, or layered textures and ruffles to add dimension.";
            avoidAdvice = "Avoid straight, shapeless cuts that don't create visual interest.";
            silhouetteKeywords = ['ruffle', 'layer', 'peplum', 'belted', 'texture', 'wrap'];
            break;
        case 'inverted triangle':
            silhouetteAdvice = "Soften the shoulders with V-necks and scoop necklines. Flared skirts and A-line dresses create beautiful harmony.";
            avoidAdvice = "Avoid boat necks, heavy shoulder details, or puffed sleeves.";
            silhouetteKeywords = ['flared', 'a-line', 'soft', 'skirt', 'v-neck'];
            break;
        default:
            silhouetteAdvice = "Focus on balanced, modest cuts that let your natural beauty speak.";
            avoidAdvice = "Avoid extremes that compromise comfort or modesty.";
            silhouetteKeywords = ['modest', 'balanced', 'classic'];
    }

    let colorPalette = [];
    let colorAdvice = "";
    let colorKeywords = [];

    switch (undertone?.toLowerCase()) {
        case 'warm':
            colorPalette = ["Mustard", "Olive", "Terracotta", "Coral", "Cream", "Gold"];
            colorAdvice = "Earthy, sun-drenched tones like mustard, olive, and terracotta will make your skin glow.";
            colorKeywords = ['mustard', 'olive', 'gold', 'red', 'cream', 'earth', 'warm', 'coral'];
            break;
        case 'cool':
            colorPalette = ["Sapphire", "Emerald", "Berry", "Ivory", "Silver", "Lavender"];
            colorAdvice = "Jewel tones like sapphire and emerald, or crisp ivory and lavender, complement your cool undertones beautifully.";
            colorKeywords = ['blue', 'green', 'white', 'silver', 'purple', 'black', 'cool', 'berry'];
            break;
        case 'neutral':
            colorPalette = ["Dusty Rose", "Teal", "Charcoal", "Champagne", "Sage"];
            colorAdvice = "You're fortunate — dusty pinks, teals, sage greens, and soft neutrals all work beautifully with your balanced tones.";
            colorKeywords = ['pink', 'teal', 'grey', 'beige', 'neutral', 'sage', 'champagne'];
            break;
        default:
            colorPalette = ["Black", "White", "Gold"];
            colorAdvice = "Classic neutrals and metallic accents are always a sophisticated choice.";
            colorKeywords = ['black', 'white', 'gold'];
    }

    let fabricAdvice = "";
    let styleTheme = "";
    let occasionKeywords = [];

    switch (occasion?.toLowerCase()) {
        case 'wedding':
            fabricAdvice = "Silk, Brocade, Lace, Velvet — fabrics that command attention and respect the occasion.";
            styleTheme = "Formal Elegance";
            occasionKeywords = ['gown', 'luxury', 'maxi', 'silk', 'elegant', 'formal'];
            break;
        case 'work':
            fabricAdvice = "Structured Cotton, Linen Blends, Crepe — professional yet breathable.";
            styleTheme = "Professional Modesty";
            occasionKeywords = ['suit', 'blazer', 'structured', 'trousers', 'skirt', 'tailored'];
            break;
        case 'casual':
            fabricAdvice = "Breathable Linen, Soft Cotton, Jersey — comfort without compromise.";
            styleTheme = "Relaxed Comfort";
            occasionKeywords = ['casual', 'linen', 'everyday', 'simple', 'tunic', 'relaxed'];
            break;
        case 'evening':
            fabricAdvice = "Silk, Satin, Embellished Tulle — let the fabric catch the light.";
            styleTheme = "Luxury Statement";
            occasionKeywords = ['evening', 'luxury', 'embellished', 'statement', 'glamour'];
            break;
        case 'worship':
            fabricAdvice = "Flowing Crepe, Modest Chiffon, Soft Georgette — reverent and graceful.";
            styleTheme = "Reverent Grace";
            occasionKeywords = ['modest', 'church', 'worship', 'flowy', 'covered', 'grace'];
            break;
        default:
            fabricAdvice = "High-quality natural fibers that honor both comfort and craftsmanship.";
            styleTheme = "Everyday Excellence";
            occasionKeywords = ['classic'];
    }

    const advice = `For a ${styleTheme} look, we recommend ${fabricAdvice.toLowerCase()} ${silhouetteAdvice.toLowerCase()} ${colorAdvice}`;

    // 2. Fetch Manukato Items (Primary Source)
    let manukatoMatches = [];
    try {
        console.log("Fetching Manukato items...");
        const allItems = await ManukatoItem.findAll({ where: { isActive: true } });
        console.log(`Found ${allItems.length} Manukato items`);

        // Keyword-based scoring
        manukatoMatches = allItems.map(item => {
            let score = 0;
            const description = item.description || "";
            const stylingTips = item.stylingTips || "";
            const brandName = item.brandName || "";
            const text = (description + " " + stylingTips + " " + brandName).toLowerCase();

            [...silhouetteKeywords, ...colorKeywords, ...occasionKeywords].forEach(kw => {
                if (text.includes(kw.toLowerCase())) score++;
            });

            return { item, score, type: 'manukato' };
        })
            .filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    } catch (e) {
        console.error("Error fetching Manukato items:", e);
    }

    // 3. Fallback: Style Inspiration
    let inspirationMatches = [];
    if (manukatoMatches.length < 2) {
        const inspirationBank = [
            { id: 'i1', title: 'Structured Power Suit', tags: ['structured', 'work', 'rectangle', 'cool'], image: '/assets/inspo/suit.jpg' },
            { id: 'i2', title: 'Flowing Boho Silk', tags: ['flowy', 'casual', 'boho', 'pear', 'warm'], image: '/assets/inspo/boho.jpg' },
            { id: 'i3', title: 'Elegant Evening Wrap', tags: ['evening', 'wedding', 'hourglass', 'warm', 'wrap'], image: '/assets/inspo/wrap.jpg' }
        ];

        inspirationMatches = inspirationBank.map(inspo => {
            let score = 0;
            if (inspo.tags.some(t => silhouetteKeywords.includes(t))) score++;
            if (inspo.tags.includes(occasion?.toLowerCase())) score += 2;
            return { item: inspo, score, type: 'inspiration' };
        })
            .filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 2);
    }

    // 4. Custom Design (Always an option)
    const customOption = {
        type: 'custom',
        item: {
            title: "Bespoke Twostones Creation",
            description: `Can't find the perfect fit? Our team will craft a unique piece tailored exactly to your ${bodyType || 'unique'} frame and specific requirements.`
        }
    };

    // Combine recommendations
    let recommendations = [...manukatoMatches];
    if (recommendations.length < 2) {
        recommendations = [...recommendations, ...inspirationMatches];
    }
    recommendations.push(customOption);

    return {
        silhouetteAdvice,
        avoidAdvice,
        colorPalette,
        colorAdvice,
        fabricAdvice,
        styleTheme,
        advice,
        recommendations
    };
};

module.exports = { getRecommendation, analyzePhoto };
