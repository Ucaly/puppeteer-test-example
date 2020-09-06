import puppeteer from 'puppeteer';
import assert from 'assert';

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let baseUrl: string;
const bobRossUrl = 'https://www.bobrosslipsum.com';

describe('Test bobrosslipsum.com ', () => {
    before(async () => {
        if (process.env.BASEURL) {
            baseUrl =  process.env.BASEURL;
        } else {
            baseUrl = bobRossUrl;
        }
        browser = await puppeteer.launch({headless: true, slowMo: 10, devtools: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        page = await browser.newPage();
        await page.setViewport({width: 1200, height: 800});
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue();
        })
        page.on('response', async (response) => {
            if(response.url().includes(bobRossUrl)) {
                console.log(`RES: ${await response.url()}`);
                console.log(`RES: ${await response.status()}`);
            } else {
                if (response.status() >= 400) {
                    console.log(`RES: ${await response.url()}`);
                    console.log(`RES: ${await response.status()}`); 
                }
            }
        })
        await page.goto(baseUrl, {waitUntil: 'networkidle2'});
    });

    it('Verify page url ', async () => {
        await page.waitFor(3000);      
        assert.equal(await page.url().includes('bobrosslipsum'), true, 'Bob Ross page loaded')
    })

    it('Verify button label ', async () => {
        console.log('Current workers:');
        for (const worker of page.workers())
            console.log('  ' + worker.url());
        // Wait for GO CRAZY button
        await page.waitForSelector('button#generateText');
        try {
            const buttonLabel = await page.$eval('button#generateText', e => e.innerHTML);
            assert.equal(buttonLabel.toLowerCase(), 'go crazy!');
        } catch (e) {
            if (e instanceof puppeteer.errors.TimeoutError) {
                throw 'Timeout error';
            }
        }
    })

    after(async () => {
        console.log('after in test')
        await browser.close();
    })
})