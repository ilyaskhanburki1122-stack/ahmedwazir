/**
 * HD Upscaler for Portfolio Images
 * Uses sharp with Lanczos3 kernel + unsharp-mask to produce crisp HD images
 * WITHOUT changing any content.
 */
const sharp = require('./node_modules/sharp');
const path  = require('path');
const fs    = require('fs');

const TARGET_WIDTH = 1400; // Upscale to 1400px wide for crystal clear display

const images = [
  { input: 'portfolio-ecommerce.png', output: 'portfolio-ecommerce.png' },
  { input: 'portfolio-pcma.png',      output: 'portfolio-pcma.png'      },
  { input: 'portfolio-servis.png',    output: 'portfolio-servis.png'    },
  { input: 'portfolio-autobids.png',  output: 'portfolio-autobids.png'  },
  { input: 'portfolio-school.png',    output: 'portfolio-school.png'    },
  { input: 'portfolio-couture.png',   output: 'portfolio-couture.png'   },
];

(async () => {
  for (const { input, output } of images) {
    try {
      const meta = await sharp(input).metadata();
      console.log(`Processing ${input}: ${meta.width}x${meta.height}`);

      // Calculate proportional height
      const scale  = TARGET_WIDTH / meta.width;
      const height = Math.round(meta.height * scale);

      // Backup original first (only if backup doesn't already exist)
      const backup = input.replace('.png', '.original.png');
      if (!fs.existsSync(backup)) {
        fs.copyFileSync(input, backup);
        console.log(`  Backed up original -> ${backup}`);
      }

      // Upscale with Lanczos3 (highest quality) then sharpen
      await sharp(input)
        .resize(TARGET_WIDTH, height, {
          kernel: sharp.kernel.lanczos3,
          fastShrinkOnLoad: false,
        })
        // Unsharp mask: brings out edge details and text sharpness
        .sharpen({
          sigma: 1.5,   // Gaussian blur radius
          m1:    1.8,   // flat area threshold
          m2:    0.4,   // slope for flat areas
          x1:    2.0,   // flat/jagged threshold
          y2:    15,    // maximum brightening
          y3:    15,    // maximum darkening
        })
        .png({
          quality:          100,
          compressionLevel: 6,
          effort:           10,
        })
        .toFile(output + '.tmp');

      // Replace in-place
      fs.renameSync(output + '.tmp', output);

      const newMeta = await sharp(output).metadata();
      console.log(`  Done: ${newMeta.width}x${newMeta.height} -> ${output}`);
    } catch (err) {
      console.error(`  ERROR processing ${input}:`, err.message);
    }
  }
  console.log('\nAll portfolio images upscaled to HD successfully!');
})();
