const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
        
        await page.goto('https://shopsmart-liard-omega.vercel.app', { waitUntil: 'networkidle0' });
        
        await browser.close();
    } catch (e) {
        console.error("Puppeteer crashed:", e);
    }
})();
