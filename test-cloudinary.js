// Test Cloudinary Connection
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: 'dqnwatzbo',
  api_key: '563719699716119',
  api_secret: 'VH1yC3of5_DL8TaY0Q5C1yw7Ijs'
});

async function testCloudinary() {
  console.log('🔍 Testing Cloudinary connection...');
  
  try {
    // Test 1: Kiểm tra kết nối
    console.log('📡 Testing connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Connection successful:', result);
    
    // Test 2: Lấy danh sách ảnh trong folder
    console.log('\n📁 Checking images in woodville-gallery folder...');
    const images = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'woodville-gallery/',
      max_results: 50
    });
    
    console.log(`📊 Found ${images.resources.length} images in woodville-gallery`);
    
    if (images.resources.length > 0) {
      console.log('\n🖼️  Sample images:');
      images.resources.slice(0, 5).forEach((img, index) => {
        console.log(`${index + 1}. ${img.public_id}`);
        console.log(`   URL: ${img.secure_url}`);
        console.log(`   Size: ${img.bytes} bytes`);
        console.log(`   Format: ${img.format}`);
        console.log('');
      });
    } else {
      console.log('❌ No images found in woodville-gallery folder');
      console.log('💡 You need to upload some images first!');
    }
    
    // Test 3: Kiểm tra upload preset
    console.log('\n⚙️  Checking upload presets...');
    const presets = await cloudinary.api.upload_presets();
    const woodvillePreset = presets.presets.find(p => p.name === 'woodville');
    
    if (woodvillePreset) {
      console.log('✅ Upload preset "woodville" found');
      console.log(`   Signing mode: ${woodvillePreset.signed ? 'Signed' : 'Unsigned'}`);
    } else {
      console.log('❌ Upload preset "woodville" not found');
      console.log('💡 Available presets:', presets.presets.map(p => p.name).join(', '));
    }
    
  } catch (error) {
    console.error('❌ Error testing Cloudinary:', error.message);
  }
}

testCloudinary();
