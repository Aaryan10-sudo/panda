const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const dbType = args[0];

const templatePath = path.join(__dirname, "../templates", `${dbType}-template`);
const targetPath = process.cwd();

if (!fs.existsSync(templatePath)) {
  console.error('⚠️ Invalid database type! Use "mongo" or "postgres"');
  process.exit(1);
}

execSync(`cp -r ${templatePath}/* ${targetPath}`);

console.log(`✅ ${dbType} template installed successfully! 🐾`);
