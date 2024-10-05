import express from 'express'
const app = express()


// import {createPlaywrightPage} from './api/playwrightPage.js'
import {createPlaywrightPage} from './playwrightPage.js'

const port = process.env.PORT || 8080;

/// full html
app.get('/fullhtml', async (req, res, next) => {
	try {
	
	const { browser, context, page } = await createPlaywrightPage();	
  
	await page.goto('https://www.essent.nl/');


		const htmler = await page.content()

		res.json({ html: htmler});

		// Close the browser
		await browser.close();
	} catch (e) {
		// Handle errors
		console.log('err play', e)
		next(e);
	}

});


/// content
import axeContent from './axeContent.js'; // for analyzing content on a page
/// timeout ughhh
app.get('/content', async (req, res, next) => {
    // try {
		const { browser, context, page } = await createPlaywrightPage();

		const url = req.query.url || 'https://snelste.nl';

        await page.goto(url);
        // await page.goto('https://essent.nl');
        // await page.goto('https://nederlandisoleert.nl');



		    // Block images, stylesheets, and fonts
			await page.route('**/*', (route) => {
				const blockedResources = ['image', 'stylesheet', 'font'];
				if (blockedResources.includes(route.request().resourceType())) {
				  route.abort();
				} else {
				  route.continue();
				}
			  });
        


		let accessibleContentResults = await axeContent(page);
// console.log("accessibleContentResults", accessibleContentResults)
		 

		// const htmlResponse = `<div>${reportHtml}</div>`;
		res.setHeader('Content-Type', 'text/json');
		res.send(accessibleContentResults);

        await context.close();
        await browser.close();
    // } catch (e) {
        // next(e);
    // }
});



app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
  });