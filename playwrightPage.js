// import playwright, {chromium, devices} from 'playwright-core';
// import playwright, { devices} from 'playwright-core';
import playwright, { devices} from 'playwright-chromium';

//// added for stealth:
import { chromium } from "playwright-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth'


// export async function createPlaywrightPage() {
	export async function createPlaywrightPage(device) {


		const stealth = StealthPlugin();
		chromium.use(stealth);

	/// NODE
	// const pwEndpoint = `ws://localhost:3000/chromium/playwright?token=6R0W53R135510&timeout=90000`;
	// const pwEndpoint = `ws://localhost:3051/chromium/playwright?token=6R0W53R135510&timeout=90000`;
	
	/// DOCKER - named endpoint base url. if in docker-network use internal port.
	// const pwEndpoint = `ws://browserlessall:3000/chromium/playwright?token=6R0W53R135510&timeout=90000`;
    

	const browser = await chromium.launch();
	// const browser = await playwright.chromium.connect(pwEndpoint);

	// const context = await browser.newContext({  bypassCSP: true, 	timeout:100000});
	const context = await browser.newContext({
        ...device, // Spread the device configuration
        bypassCSP: true,
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        timeout: 100000
    });
    const page = await context.newPage();
    
    return { browser, context, page };
	
}