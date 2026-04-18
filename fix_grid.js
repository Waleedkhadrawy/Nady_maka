const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src', 'dashboard', 'pages');

if (fs.existsSync(dashboardDir)) {
  const files = fs.readdirSync(dashboardDir);
  files.forEach(f => {
    if (f.endsWith('.js')) {
      const filePath = path.join(dashboardDir, f);
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Replace gridTemplateColumns: 'repeat(X, 1fr)' with 'repeat(auto-fit, minmax(200px, 1fr))'
      // Covers single quotes, double quotes
      content = content.replace(/gridTemplateColumns:\s*(['"`])repeat\(\s*\d+\s*,\s*1fr\s*\)\1/g, "gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'");
      
      // Replace gridColumn: 'span X' with gridColumn: '1 / -1' to ensure buttons span fully
      content = content.replace(/gridColumn:\s*(['"`])span\s+\d+\1/g, "gridColumn: '1 / -1'");
      
      // Let's also catch simple missing quotes if possible, though React style requires strings
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Responsive grid applied to ${f}`);
    }
  });
}
