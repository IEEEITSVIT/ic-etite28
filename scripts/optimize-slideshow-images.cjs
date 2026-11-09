const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const sourceRoot = path.join(
  process.cwd(),
  "pics",
  "Website Converted",
  "Slideshow"
);

const outputRoot = path.join(
  process.cwd(),
  "public",
  "images",
  "icetite24-slideshow"
);

const groups = {
  inauguration: [
    "inauguration (1).webp",
    "inauguration (2).webp",
    "inauguration (3).webp",
    "inauguration (4).webp",
    "inauguration (5).webp",
    "inauguration (6).webp",
  ],
  presentation: [
    "Presentation (1).webp",
    "Presentation (2).webp",
    "Presentation (3).webp",
  ],
  "bolt-hackathon": [
    "Bolt Hackathon (1).webp",
    "Bolt Hackathon (2).webp",
    "Bolt Hackathon (3).webp",
  ],
  "evening-dinner": [
    "Evening Dinner Events (1).webp",
    "Evening Dinner Events (2).webp",
    "Evening Dinner Events (3).webp",
    "Evening Dinner Events (4).webp",
    "Evening Dinner Events (5).webp",
    "Evening Dinner Events (6).webp",
    "Evening Dinner Events (7).webp",
    "Evening Dinner Events (8).webp",
  ],
  technext24: [
    "TechNext'24 (1).webp",
    "TechNext'24 (2).webp",
    "TechNext'24 (3).webp",
    "TechNext'24 (4).webp",
    "TechNext'24 (5).webp",
    "TechNext'24 (6).webp",
  ],
  "panel-discussion": [
    "Panel Discussion (1).webp",
    "Panel Discussion (2).webp",
    "Panel Discussion (3).webp",
  ],
  valedictory: [
    "Valedictory (1).webp",
    "Valedictory (2).webp",
    "Valedictory (3).webp",
  ],
};

async function optimizeImage(input, output, options) {
  await sharp(input)
    .rotate()
    .resize({
      width: options.width,
      height: options.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: options.quality,
      effort: 5,
      smartSubsample: true,
    })
    .toFile(output);
}

async function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source folder not found: ${sourceRoot}`);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const [group, files] of Object.entries(groups)) {
    const fullDir = path.join(outputRoot, group);
    const thumbDir = path.join(outputRoot, "thumbs", group);

    fs.mkdirSync(fullDir, { recursive: true });
    fs.mkdirSync(thumbDir, { recursive: true });

    for (const filename of files) {
      const input = path.join(sourceRoot, filename);

      if (!fs.existsSync(input)) {
        throw new Error(`Missing slideshow image: ${input}`);
      }

      const output = path.join(fullDir, filename);
      const thumbnail = path.join(thumbDir, filename);

      await optimizeImage(input, output, {
        width: 1800,
        height: 1200,
        quality: 76,
      });

      await optimizeImage(input, thumbnail, {
        width: 320,
        height: 220,
        quality: 65,
      });

      const before = fs.statSync(input).size;
      const after = fs.statSync(output).size;

      totalBefore += before;
      totalAfter += after;
      count++;

      console.log(
        `${filename}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`
      );
    }
  }

  const expectedCount = Object.values(groups).reduce(
    (total, files) => total + files.length,
    0
  );
  if (count !== expectedCount) {
    throw new Error(`Expected ${expectedCount} images, optimized ${count}.`);
  }

  console.log("\nOptimization completed.");
  console.log(`Images processed: ${count}`);
  console.log(`Original size: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized size: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `Reduction: ${totalBefore ? (100 - (totalAfter / totalBefore) * 100).toFixed(1) : 0}%`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
