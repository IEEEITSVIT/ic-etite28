const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const sourceDir = path.resolve("public");
const outputDir = path.join(sourceDir, "optimized");

const supported = /\.(jpe?g|png|webp|tiff?)$/i;
const ignoredDirs = new Set(["optimized"]);

let converted = 0;
let failed = 0;
let originalBytes = 0;
let optimizedBytes = 0;

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const input = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (path.resolve(input) === outputDir ||
          entry.name === ".git") continue;

      await walk(input);
      continue;
    }

    if (!entry.isFile() || !supported.test(entry.name)) continue;

    // Preserve the original directory structure inside public/optimized.
    const relative = path.relative(sourceDir, input);
    const output = path.join(
      outputDir,
      path.dirname(relative),
      path.parse(entry.name).name + ".webp"
    );

    try {
      fs.mkdirSync(path.dirname(output), { recursive: true });

      const result = await sharp(input)
        .rotate()
        .resize({
          width: 1920,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true
        })
        .webp({ quality: 78, effort: 4 })
        .toFile(output);

      const before = fs.statSync(input).size;
      const after = result.size;

      originalBytes += before;
      optimizedBytes += after;
      converted++;

      const change = Math.round((1 - after / before) * 100);

      console.log(
        `[${converted}] ${relative} -> ` +
        `${path.relative(sourceDir, output)} | ` +
        `${(before / 1024).toFixed(1)} KB -> ` +
        `${(after / 1024).toFixed(1)} KB (${change}% change)`
      );
    } catch (error) {
      failed++;
      console.error(`FAILED: ${relative}: ${error.message}`);
    }
  }
}

async function main() {
  if (!fs.existsSync(sourceDir)) {
    throw new Error("public folder was not found.");
  }

  fs.mkdirSync(outputDir, { recursive: true });

  console.log("Starting image optimization...");
  console.log("Originals will not be modified.\n");

  await walk(sourceDir);

  console.log("\n========== SUMMARY ==========");
  console.log(`Converted: ${converted}`);
  console.log(`Failed: ${failed}`);
  console.log(`Original total: ${(originalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized total: ${(optimizedBytes / 1024 / 1024).toFixed(2)} MB`);

  if (originalBytes > 0) {
    console.log(
      `Overall size reduction: ${
        ((1 - optimizedBytes / originalBytes) * 100).toFixed(1)
      }%`
    );
  }

  console.log(`\nOutput folder: ${outputDir}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
