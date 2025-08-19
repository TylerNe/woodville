const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cấu hình Cloudinary (thay thế bằng thông tin của bạn)
cloudinary.config({
  cloud_name: 'dqnwatzbo',
  api_key: '563719699716119',
  api_secret: 'VH1yC3of5_DL8TaY0Q5C1yw7Ijs'
});

// Thư mục chứa ảnh
const imagesDir = './images';

// Hàm upload ảnh
async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'woodville-gallery',
      public_id: path.basename(filePath, path.extname(filePath))
    });
    console.log(`✅ Uploaded: ${filePath} -> ${result.secure_url}`);
    return result.secure_url;
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

// Main function
async function uploadAllImages() {
  console.log('🚀 Starting upload to Cloudinary...');
  
  const imageFiles = getImageFiles(imagesDir);
  console.log(`📁 Found ${imageFiles.length} images to upload`);
  
  const uploadedUrls = [];
  
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    const url = await uploadImage(filePath);
    if (url) {
      uploadedUrls.push({
        original: file,
        cloudinary: url
      });
    }
  }
  
  // Lưu danh sách URL vào file
  fs.writeFileSync('cloudinary_urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log('✅ Upload completed! Check cloudinary_urls.json for URLs');
}

uploadAllImages();
