/**
 * Capture HD Full-Page Screenshots from demo pages
 * Uses Puppeteer with the system's installed Chrome to render each demo page
 * at proper 1400px resolution and capture crisp, full-page screenshots.
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const VIEWPORT_WIDTH = 1400;
const BASE_URL = 'http://localhost:5173';

const pages = [
  { url: '/demo-ecommerce.html',  output: 'portfolio-ecommerce.png' },
  { url: '/demo-pcma.html',       output: 'portfolio-pcma.png' },
  { url: '/demo-servis.html',     output: 'portfolio-servis.png' },
  { url: '/demo-autobids.html',   output: 'portfolio-autobids.png' },
  { url: '/demo-school.html',     output: 'portfolio-school.png' },
  { url: '/luxe-apparel.html',    output: 'portfolio-couture.png' },
];

(async () => {
  console.log('Launching Chrome from system installation...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-device-scale-factor=1',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });

  for (const { url, output } of pages) {
    try {
      console.log(`\nCapturing: ${url} -> ${output}`);
      const page = await browser.newPage();

      // Set viewport to 1400px wide for HD quality
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: 900,
        deviceScaleFactor: 1,
      });

      // Navigate and wait for full render
      await page.goto(`${BASE_URL}${url}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait for fonts, images and animations to fully settle
      await new Promise(r => setTimeout(r, 3000));

      // Take full-page screenshot at native resolution
      const outputPath = path.join(__dirname, output);
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: 'png',
      });

      // Read and verify dimensions
      const buf = fs.readFileSync(outputPath);
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      console.log(`  ✓ Saved: ${w}x${h} (${Math.round(buf.length / 1024)}KB)`);

      await page.close();
    } catch (err) {
      console.error(`  ✗ ERROR: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n✅ All HD screenshots captured successfully!');
})();
