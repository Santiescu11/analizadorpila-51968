// fix-imports.js
import fs from 'fs';
import path from 'path';

const GENERATED_DIR = './generated';

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixedContent = content.replace(/import\s+antlr4\s+from\s+['"]#antlr4['"]/g, "import antlr4 from 'antlr4'");
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`✅ Corregido: ${filePath}`);
  }
}

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && file.endsWith('.js')) {
      fixImportsInFile(fullPath);
    }
  });
}

processDirectory(GENERATED_DIR);
