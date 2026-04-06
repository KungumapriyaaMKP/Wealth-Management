const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance2').default;

const TROY_OUNCE_TO_GRAMS = 31.1034768;

router.get('/', async (req, res) => {
    try {
        // Fetch real-time data for Gold (GC=F), Silver (SI=F), USD/INR (INR=X)
        const [goldQuote, silverQuote, inrQuote] = await Promise.all([
            yahooFinance.quote('GC=F'),     // Gold Comex Futures
            yahooFinance.quote('SI=F'),     // Silver Comex Futures
            yahooFinance.quote('INR=X')     // USD to INR conversion
        ]);

        const usdToInr = inrQuote.regularMarketPrice;
        
        // Prices are per troy ounce in USD
        const goldUsdPerOz = goldQuote.regularMarketPrice;
        const silverUsdPerOz = silverQuote.regularMarketPrice;

        // Convert to INR per Gram
        const goldInrPerGram = (goldUsdPerOz * usdToInr) / TROY_OUNCE_TO_GRAMS;
        const silverInrPerGram = (silverUsdPerOz * usdToInr) / TROY_OUNCE_TO_GRAMS;

        res.json({
            gold: {
                current_price: parseFloat(goldInrPerGram.toFixed(2)),
                change_percent: parseFloat(goldQuote.regularMarketChangePercent.toFixed(2)),
                last_updated: new Date()
            },
            silver: {
                current_price: parseFloat(silverInrPerGram.toFixed(2)),
                change_percent: parseFloat(silverQuote.regularMarketChangePercent.toFixed(2)),
                last_updated: new Date()
            },
            conversion: {
                usd_to_inr: usdToInr
            }
        });
    } catch (error) {
        console.error("Market API Error:", error.message);
        // Fallback mock data if API gets rate-limited
        res.json({
            gold: { current_price: 7250.00, change_percent: 0.15, last_updated: new Date() },
            silver: { current_price: 86.20, change_percent: -0.2, last_updated: new Date() }
        });
    }
});

module.exports = router;
