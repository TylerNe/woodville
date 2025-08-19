const fs = require('fs');

// Đọc file cloudinary_urls.json (được tạo sau khi upload)
const urls = JSON.parse(fs.readFileSync('cloudinary_urls.json', 'utf8'));

// Đọc file HTML
let html = fs.readFileSync('index.html', 'utf8');

// Thay thế từng đường dẫn ảnh
urls.forEach(item => {
  const oldPath = `images/${item.original}`;
  const newPath = item.cloudinary;
  
  // Thay thế trong src attribute
  html = html.replace(new RegExp(`src="${oldPath}"`, 'g'), `src="${newPath}"`);
  
  console.log(`🔄 Replaced: ${oldPath} -> ${newPath}`);
});

// Lưu file HTML mới
fs.writeFileSync('index_cloudinary.html', html);
console.log('✅ Updated HTML saved as index_cloudinary.html');
