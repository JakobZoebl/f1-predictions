const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, extensions, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (file === 'node_modules' || file === '.git' || file === '__pycache__') return;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, extensions, arrayOfFiles);
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

try {
  let output = "--- DEAD CODE SCANNING ---\n";
  const frontendDir = path.join('c:', 'Uni', 'Projekte', 'f1-predictions', 'src');
  const backendDir = path.join('c:', 'Uni', 'Projekte', 'f1-predictions', 'api');

  const tsFiles = getAllFiles(frontendDir, ['.ts', '.tsx']);
  const cssFiles = getAllFiles(frontendDir, ['.css']);
  const pyFiles = getAllFiles(backendDir, ['.py']);

  let allTsContent = "";
  tsFiles.forEach(f => {
    try { allTsContent += fs.readFileSync(f, 'utf-8') + "\n"; } catch (e) {}
  });

  output += "\n[FRONTEND] Potentially unused TS/TSX files:\n";
  tsFiles.forEach(f => {
    const basename = path.basename(f);
    const nameNoExt = path.parse(basename).name;
    if (['main', 'App', 'vite-env.d', 'f1-presets'].includes(nameNoExt)) return;
    const count = (allTsContent.match(new RegExp(nameNoExt, 'g')) || []).length;
    if (count < 2) {
      output += `- ${f}\n`;
    }
  });

  output += "\n[CSS] Potentially unused CSS files:\n";
  cssFiles.forEach(f => {
    const basename = path.basename(f);
    if (!allTsContent.includes(basename)) {
      output += `- ${f}\n`;
    }
  });

  output += "\n[CSS] Checking for unused CSS classes in F1Footer and F1Header:\n";
  cssFiles.forEach(f => {
    if (f.includes('F1Footer.css') || f.includes('F1Header.css')) {
      try {
        const content = fs.readFileSync(f, 'utf-8');
        const classMatches = content.match(/\.([a-zA-Z0-9_-]+)\s*\{/g) || [];
        const classes = [...new Set(classMatches.map(c => c.replace('.', '').replace('{', '').trim()))];
        classes.forEach(c => {
          if (!allTsContent.includes(c)) {
            output += `- Unused class '${c}' in ${path.basename(f)}\n`;
          }
        });
      } catch (e) {}
    }
  });

  let allPyContent = "";
  pyFiles.forEach(f => {
    try { allPyContent += fs.readFileSync(f, 'utf-8') + "\n"; } catch (e) {}
  });

  output += "\n[BACKEND] Potentially unused Python files:\n";
  pyFiles.forEach(f => {
    const basename = path.basename(f);
    const nameNoExt = path.parse(basename).name;
    if (['index', 'dev_server', '__init__'].includes(nameNoExt)) return;
    const count = (allPyContent.match(new RegExp(nameNoExt, 'g')) || []).length;
    if (count < 2) {
      output += `- ${f}\n`;
    }
  });

  fs.writeFileSync('unused.txt', output, 'utf-8');
  console.log("Done checking dead code");
} catch (e) {
  console.error(e);
}
