import puppeteer from 'puppeteer';
declare var browser: puppeteer.Browser;
declare var baseUrl: string;
declare namespace NodeJS {
    interface Global {
        browser: puppeteer.Browser;
        baseUrl: string;
    }
}
