import puppeteer from 'puppeteer';
import assert from 'assert';

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let baseUrl: string;
const bobRossUrl = 'https://www.bobrosslipsum.com';

describe('Test bobrosslipsum.com ', () => {
    before(async () => {
        console.log('log1');
        if (process.env.BASEURL) {
            baseUrl =  process.env.BASEURL;
        } else {
            baseUrl = bobRossUrl;
        }
        console.log('log2');
        // browser = await puppeteer.launch({executablePath: 'google-chrome-unstable', headless: true, slowMo: 10, devtools: false, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
        browser = await puppeteer.launch({headless: true, slowMo: 10, devtools: false, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
        console.log('log3');
        page = await browser.newPage();
        console.log('log4');
        await page.setViewport({width: 1200, height: 800});
        console.log('log5');
        await page.setRequestInterception(true);
        console.log('log6');
        page.on('request', (request) => {
            request.continue();
        })
        console.log('log7');
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
        console.log('log8');
        await page.goto(baseUrl, {waitUntil: 'networkidle2'});
        console.log('log9');
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