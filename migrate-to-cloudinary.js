const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'dqnwatzbo',
  api_key: '563719699716119',
  api_secret: 'VH1yC3of5_DL8TaY0Q5C1yw7Ijs'
});

// Thư mục chứa ảnh
const imagesDir = './images';

// Hàm upload ảnh với metadata
async function uploadImageWithMetadata(filePath) {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Đọc HTML để lấy metadata
    const html = fs.readFileSync('index.html', 'utf8');
    const imgRegex = new RegExp(`src="images/${fileName}\\.[^"]*"[^>]*data-cat="([^"]*)"[^>]*data-search="([^"]*)"`, 'g');
    const match = imgRegex.exec(html);
    
    let category = 'wv';
    let tags = fileName;
    
    if (match) {
      category = match[1];
      tags = match[2];
    }
    
    // Upload to Cloudinary với metadata
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'woodville-gallery',
      public_id: fileName,
      context: {
        category: category,
        tags: tags
      },
      tags: tags
    });
    
    console.log(`✅ Uploaded: ${fileName} -> ${result.secure_url}`);
    console.log(`   Category: ${category}, Tags: ${tags}`);
    
    return {
      original: path.basename(filePath),
      cloudinary: result.secure_url,
      category: category,
      tags: tags
    };
    
  } catch (error) {
    console.error(`❌ Error uploading ${filePath}:`, error.message);
    return null;
  }
}

// Hàm đọc tất cả file ảnh
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
}

// Hàm cập nhật HTML
function updateHTML(uploadedUrls) {
  let html = fs.readFileSync('index.html', 'utf8');
  
  uploadedUrls.forEach(item => {
    if (item) {
      const oldPath = `images/${item.original}`;
      const newPath = item.cloudinary;
      
      // Thay thế trong src attribute
      html = html.replace(new RegExp(`src="${oldPath}"`, 'g'), `src="${newPath}"`);
      
      console.log(`🔄 Replaced: ${oldPath} -> ${newPath}`);
    }
  });
  
  // Lưu file HTML mới
  fs.writeFileSync('index_cloudinary.html', html);
  console.log('✅ Updated HTML saved as index_cloudinary.html');
}

// Main function
async function migrateToCloudinary() {
  console.log('🚀 Starting migration to Cloudinary...');
  
  const imageFiles = getImageFiles(imagesDir);
  console.log(`📁 Found ${imageFiles.length} images to migrate`);
  
  const uploadedUrls = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const filePath = path.join(imagesDir, file);
    
    console.log(`📤 Uploading ${i + 1}/${imageFiles.length}: ${file}`);
    const result = await uploadImageWithMetadata(filePath);
    uploadedUrls.push(result);
    
    // Delay để tránh rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Cập nhật HTML
  updateHTML(uploadedUrls);
  
  // Lưu danh sách URL
  fs.writeFileSync('migrated_urls.json', JSON.stringify(uploadedUrls, null, 2));
  
  const successCount = uploadedUrls.filter(item => item !== null).length;
  console.log(`✅ Migration completed! ${successCount}/${imageFiles.length} images uploaded`);
  console.log('📄 Check migrated_urls.json for details');
}

// Chạy migration
migrateToCloudinary();
