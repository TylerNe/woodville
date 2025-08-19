const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'dqnwatzbo',
  api_key: '563719699716119',
  api_secret: 'VH1yC3of5_DL8TaY0Q5C1yw7Ijs'
});

async function updateImagesList() {
  try {
    console.log('🔄 Updating images list from Cloudinary...');
    
    // Lấy danh sách ảnh từ Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'woodville-gallery/',
      max_results: 500
    });
    
    const images = result.resources.map(img => {
      // Xác định category dựa trên tên file
      const category = getCategoryFromName(img.public_id.split('/').pop());
      
      return {
        name: img.public_id.split('/').pop(),
        url: img.secure_url,
        category: category,
        tags: img.context?.tags || img.public_id.split('/').pop()
      };
    });
    
    // Tạo object JSON
    const jsonData = { images };
    
    // Lưu vào file
    fs.writeFileSync('images-list.json', JSON.stringify(jsonData, null, 2));
    
    console.log(`✅ Updated images-list.json with ${images.length} images`);
    
  } catch (error) {
    console.error('❌ Error updating images list:', error);
  }
}

// Xác định category dựa trên tên file
function getCategoryFromName(fileName) {
  if (fileName.includes('bien') || fileName.includes('sea')) return 'beach';
  if (fileName.includes('soccer') || fileName.includes('IMG_1745')) return 'sport';
  if (fileName.includes('hotpot') || fileName.includes('kem') || fileName.includes('dumlingking') || fileName.includes('thanhthanh') || fileName.includes('hotdog')) return 'eat';
  if (fileName.includes('city') || fileName.includes('train') || fileName.includes('rebel') || fileName.includes('arndale') || fileName.includes('flinder')) return 'cty';
  if (fileName.includes('nui') || fileName.includes('outdoor')) return 'nui';
  return 'wv'; // WoodVille là default
}

// Chạy update
updateImagesList();
