const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'src', 'dashboard', 'pages'),
  path.join(__dirname, 'src', 'pages')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('alert(')) return; // Nothing to change

  // Add import if not present
  if (!content.includes("from 'react-hot-toast'") && !content.includes('from "react-hot-toast"')) {
    // Insert after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const newLineIndex = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, newLineIndex + 1) + "import toast from 'react-hot-toast';\n" + content.slice(newLineIndex + 1);
    } else {
      content = "import toast from 'react-hot-toast';\n" + content;
    }
  }

  // Find catch blocks like `catch (e) { alert(...) }` or `catch { alert(...) }`
  // Replace `alert('some string')` within catch blocks to `toast.error(e.message || 'some string')`
  
  // A generic replacement for alert('...') -> toast.error('...')
  // but there are some non-error alerts? Most alerts in this codebase are errors except maybe confirm dialogs.
  // wait, window.confirm is not alert.
  
  // Let's replace catch (e) { alert('msg'); } or catch { alert('msg'); }
  // We'll just replace alert( with toast.error( globally for this specific refactor,
  // EXCEPT we should pass the real error if it's a catch block.
  
  // Actually, replacing `alert(` with `toast.error(` is 90% good.
  // And for specific success cases we can add static ones. Let's do a regex replacement.
  content = content.replace(/\balert\(/g, 'toast.error(');
  
  // Also let's find `alert('تم إنشاء الطلب بنجاح');` etc if they exist and make them toast.success
  // Actually, `toast.error('تم الإرسال بنجاح')` would be bad!
  // I will just change "toast.error('تم" -> "toast.success('تم"
  // and "toast.error('Success" -> "toast.success('Success"
  content = content.replace(/toast\.error\((['"`])(.*?(تم|success).*?)\1\)/gi, "toast.success($1$2$1)");

  // Let's also rewrite the catch blocks so they use e.message
  content = content.replace(/catch\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*\{([^}]*)toast\.error\((['"`])([^'"`]+)\3\)/g, 
    "catch ($1) {$2toast.error($1.message || $3$4$3)");
    
  // If it's `catch { toast.error('msg') }`
  content = content.replace(/catch\s*\{([^}]*)toast\.error\((['"`])([^'"`]+)\2\)/g, 
    "catch (err) {$1toast.error(err.message || $2$3$2)");

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${path.basename(filePath)}`);
}

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
      if (f.endsWith('.js')) {
        processFile(path.join(dir, f));
      }
    });
  }
});
