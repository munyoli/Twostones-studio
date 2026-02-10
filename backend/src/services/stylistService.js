const { ManukatoItem } = require('../models');
const { Op } = require('sequelize');

const getRecommendation = async (data) => {
    console.log("getRecommendation called with:", JSON.stringify(data));
    const { bodyType, undertone, occasion } = data;

    // 1. Rules Engine: Define Advice & Keywords
    let silhouetteKeywords = [];
    let silhouetteAdvice = "";
    let avoidAdvice = "";

    switch (bodyType?.toLowerCase()) {
        case 'hourglass':
            silhouetteAdvice = "Focus on tailored cuts that highlight your waist. Wrap dresses, peplum tops, and belted jackets.";
            avoidAdvice = "Avoid boxy, shapeless silhouettes.";
            silhouetteKeywords = ['belted', 'wrap', 'waist', 'fitted', 'tailored'];
            break;
        case 'pear':
            silhouetteAdvice = "Opt for A-line skirts and wide-leg trousers to flow over hips, paired with fitted tops.";
            avoidAdvice = "Avoid tight-fitting bottoms.";
            silhouetteKeywords = ['a-line', 'wide-leg', 'flow', 'skirt', 'waist'];
            break;
        case 'apple':
            silhouetteAdvice = "Create elongation with empire waists, flowy tunics, and deep V-necklines.";
            avoidAdvice = "Avoid clinging fabrics around the midsection.";
            silhouetteKeywords = ['empire', 'tunic', 'loose', 'flowy', 'kaftan'];
            break;
        case 'rectangle':
            silhouetteAdvice = "Create curves with intention. Use belts to define a waist, or layered textures.";
            avoidAdvice = "Avoid straight, shapeless cuts.";
            silhouetteKeywords = ['ruffle', 'layer', 'peplum', 'belted', 'texture'];
            break;
        case 'inverted triangle':
            silhouetteAdvice = "Soften the shoulders. Flared skirts and A-line dresses create harmony.";
            avoidAdvice = "Avoid boat necks or heavy shoulder pads.";
            silhouetteKeywords = ['flared', 'a-line', 'soft', 'skirt'];
            break;
        default:
            silhouetteAdvice = "Focus on balanced, modest cuts.";
            avoidAdvice = "Avoid extremes that compromise comfort.";
            silhouetteKeywords = ['modest', 'balanced', 'classic'];
    }

    let colorPalette = [];
    let colorAdvice = "";
    let colorKeywords = [];

    switch (undertone?.toLowerCase()) {
        case 'warm':
            colorPalette = ["Mustard", "Olive", "Red", "Coral", "Cream", "Gold"];
            colorAdvice = "Earthy, sun-drenched tones like mustard and olive.";
            colorKeywords = ['mustard', 'olive', 'gold', 'red', 'cream', 'earth'];
            break;
        case 'cool':
            colorPalette = ["Sapphire", "Emerald", "Berry", "White", "Silver"];
            colorAdvice = "Jewel tones like sapphire and emerald or crisp whites.";
            colorKeywords = ['blue', 'green', 'white', 'silver', 'purple', 'black'];
            break;
        case 'neutral':
            colorPalette = ["Dusty Rose", "Teal", "Charcoal", "Champagne"];
            colorAdvice = "Dusty pinks, teals, and neutrals fit you perfectly.";
            colorKeywords = ['pink', 'teal', 'grey', 'beige', 'neutral'];
            break;
        default:
            colorPalette = ["Black", "White", "Gold"];
            colorAdvice = "Classic neutrals and metallic accents.";
            colorKeywords = ['black', 'white', 'gold'];
    }

    let fabricAdvice = "";
    let styleTheme = "";
    let occasionKeywords = [];

    switch (occasion?.toLowerCase()) {
        case 'wedding':
            fabricAdvice = "Silk, Brocade, Lace, Velvet.";
            styleTheme = "Formal Elegance";
            occasionKeywords = ['gown', 'luxury', 'maxi', 'silk', 'elegant'];
            break;
        case 'work':
            fabricAdvice = "Structured Cotton, Linen Blends.";
            styleTheme = "Professional Modesty";
            occasionKeywords = ['suit', 'blazer', 'structured', 'trousers', 'skirt'];
            break;
        case 'casual':
            fabricAdvice = "Breathable Linen, Soft Cotton.";
            styleTheme = "Relaxed Comfort";
            occasionKeywords = ['casual', 'linen', 'everyday', 'simple', 'tunic'];
            break;
        case 'evening':
            fabricAdvice = "Silk, Satin, Embellished Tulle.";
            styleTheme = "Luxury Statement";
            occasionKeywords = ['evening', 'luxury', 'embellished', 'statement'];
            break;
        case 'worship':
            fabricAdvice = "Flowing Crepe, Modest Chiffon.";
            styleTheme = "Reverent Grace";
            occasionKeywords = ['modest', 'church', 'worship', 'flowy', 'covered'];
            break;
        default:
            fabricAdvice = "High-quality natural fibers.";
            styleTheme = "Everyday Excellence";
            occasionKeywords = ['classic'];
    }

    const advice = `For a ${styleTheme} look, we recommend ${fabricAdvice} tailored in ${silhouetteAdvice.toLowerCase()} ${colorAdvice}`;

    // 2. Fetch Manukato Items (Primary Source)
    let manukatoMatches = [];
    try {
        console.log("Fetching Manukato items...");
        const allItems = await ManukatoItem.findAll({ where: { isActive: true } });
        console.log(`Found ${allItems.length} Manukato items`);

        // Simple scoring based on keyword overlap
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
            .slice(0, 3); // Top 3 matches
    } catch (e) {
        console.error("Error fetching Manukato items:", e);
    }

    // 3. Fallback: Style Inspiration (Secondary Source)
    // If we have fewer than 2 Manukato matches, check inspiration bank
    let inspirationMatches = [];
    if (manukatoMatches.length < 2) {
        // Mock Inspiration Bank (In real app, this could be a DB table)
        const inspirationBank = [
            { id: 'i1', title: 'Structured Power Suit', tags: ['structured', 'work', 'rectangle', 'cool'], image: '/assets/inspo/suit.jpg' },
            { id: 'i2', title: 'Flowing Boho Silk', tags: ['flowy', 'casual', 'boho', 'pear', 'warm'], image: '/assets/inspo/boho.jpg' },
            { id: 'i3', title: 'Elegant Evening Wrap', tags: ['evening', 'wedding', 'hourglass', 'warm', 'wrap'], image: '/assets/inspo/wrap.jpg' }
        ];

        inspirationMatches = inspirationBank.map(inspo => {
            let score = 0;
            // Simplified matching
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
            description: `Can't find the perfect fit? Our team will craft a unique piece tailored exactly to your ${bodyType} frame and specific requirements.`
        }
    };

    // Combine recommendations: Manukato -> Inspiration -> Custom
    let recommendations = [...manukatoMatches];
    if (recommendations.length < 2) {
        recommendations = [...recommendations, ...inspirationMatches];
    }
    recommendations.push(customOption); // Always append custom option

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

module.exports = { getRecommendation };
