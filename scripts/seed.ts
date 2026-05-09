#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

console.log("🌱 Seeding Embedded Study Hub with sample content...\n");

// Check if content already exists
const canBusPath = path.join(contentDir, "protocols", "can-bus", "index.md");
if (fs.existsSync(canBusPath)) {
  console.log("✅ Sample content already exists!");
  console.log("\nExisting topics:");
  
  function listTopics(dir: string, indent = "") {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${indent}📁 ${file}`);
        listTopics(fullPath, indent + "  ");
      } else if (file === "index.md") {
        const content = fs.readFileSync(fullPath, "utf8");
        const titleMatch = content.match(/title:\s*"([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : file;
        console.log(`${indent}📄 ${title}`);
      }
    }
  }
  
  listTopics(contentDir);
  process.exit(0);
}

// Create directories
const dirs = [
  "protocols/can-bus",
  "protocols/spi",
  "rtos/freertos-basics",
  "toolchain",
  "japanese/technical-terms",
];

for (const dir of dirs) {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

console.log("\n✅ Seed complete! Run 'npm run dev' to start the development server.");
console.log("\n📚 Next steps:");
console.log("   1. npm install");
console.log("   2. npm run dev");
console.log("   3. Open http://localhost:3000");
