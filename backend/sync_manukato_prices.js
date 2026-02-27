const { ManukatoItem } = require('./src/models');
const fs = require('fs');
const path = require('path');

const syncPrices = async () => {
    try {
        const configPath = path.join(__dirname, './src/data/manukato_prices.json');
        if (!fs.existsSync(configPath)) {
            console.error('Price config file not found!');
            return;
        }

        const pricesConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const overrides = pricesConfig.overrides;

        console.log('--- Starting Price Sync ---');

        for (const [originalName, config] of Object.entries(overrides)) {
            const item = await ManukatoItem.findOne({ where: { originalName } });

            if (item) {
                let newPrice;
                let showInShop = true;

                if (typeof config === 'object') {
                    newPrice = config.price;
                    showInShop = config.show_in_shop !== undefined ? config.show_in_shop : true;
                } else {
                    newPrice = config;
                }

                if (item.price !== newPrice || item.showInShop !== showInShop) {
                    await item.update({ price: newPrice, showInShop });
                    console.log(`Updated ${originalName}: KES ${newPrice} (Show in shop: ${showInShop})`);
                }
            } else {
                console.warn(`Item not found in DB: ${originalName}`);
            }
        }

        console.log('--- Price Sync Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Price sync failed:', error);
        process.exit(1);
    }
};

syncPrices();
