// Cloudinary Gallery Real-time (Không cần cập nhật file JSON)
class CloudinaryGalleryRealtime {
    constructor() {
        this.cloudName = 'dqnwatzbo';
        this.folder = 'woodville-gallery';
        this.imageContainer = document.querySelector('.image-container');
        this.knownImages = new Set(); // Lưu ảnh đã hiển thị
        this.init();
    }

    async init() {
        // Hiển thị loading
        this.showLoading();
        
        // Load ảnh từ Cloudinary
        await this.loadImagesFromCloudinary();
        
        // Setup auto refresh
        this.setupAutoRefresh();
    }

    // Hiển thị loading
    showLoading() {
        this.imageContainer.innerHTML = `
            <div class="gallery-loading">
                <i class="fas fa-spinner"></i>
                <p>Loading images from Cloudinary...</p>
            </div>
        `;
    }

    // Load ảnh từ Cloudinary (sử dụng URL transformation)
    async loadImagesFromCloudinary() {
        try {
            console.log('🔄 Loading images from Cloudinary...');
            
            // Sử dụng Cloudinary URL transformation để lấy danh sách ảnh
            const response = await fetch(`https://res.cloudinary.com/${this.cloudName}/image/list/${this.folder}.json`);
            
            if (!response.ok) {
                throw new Error('Failed to load images from Cloudinary');
            }
            
            const data = await response.json();
            const images = data.resources || [];
            
            console.log(`✅ Loaded ${images.length} images from Cloudinary`);
            
            // Render ảnh
            this.renderImages(images);
            
        } catch (error) {
            console.error('❌ Error loading images:', error);
            // Fallback to local images
            this.loadLocalImages();
        }
    }

    // Load ảnh local (fallback)
    loadLocalImages() {
        console.log('📁 Loading local images as fallback...');
        const localImages = document.querySelectorAll('img[src^="images/"]');
        
        if (localImages.length > 0) {
            console.log(`📁 Found ${localImages.length} local images`);
            // Local images đã có sẵn trong HTML, không cần làm gì
        } else {
            this.showNoImages();
        }
    }

    // Hiển thị khi không có ảnh
    showNoImages() {
        this.imageContainer.innerHTML = `
            <div class="gallery-loading">
                <i class="fas fa-images"></i>
                <p>No images found. Upload some images to get started!</p>
            </div>
        `;
    }

    // Render ảnh vào gallery
    renderImages(images) {
        // Clear loading
        this.imageContainer.innerHTML = '';
        
        if (images.length === 0) {
            this.showNoImages();
            return;
        }
        
        // Add images from Cloudinary
        images.forEach(image => {
            this.addImageToGallery(
                image.secure_url,
                image.context?.category || 'wv',
                image.tags || image.public_id,
                image.public_id
            );
        });
        
        console.log(`🎨 Rendered ${images.length} images`);
    }

    // Thêm ảnh vào gallery
    addImageToGallery(imageUrl, category, tags, fileName) {
        // Kiểm tra xem ảnh đã tồn tại chưa
        if (this.knownImages.has(fileName)) {
            return;
        }
        
        this.knownImages.add(fileName);
        
        const img = document.createElement('img');
        
        img.src = imageUrl;
        img.setAttribute('data-cat', category);
        img.setAttribute('data-search', tags || fileName);
        img.alt = fileName;
        
        // Add click event for popup
        img.addEventListener('click', () => {
            const popup = document.querySelector('.image-popup');
            const popupImg = popup.querySelector('img');
            popupImg.src = imageUrl;
            popup.style.display = 'flex';
        });
        
        this.imageContainer.appendChild(img);
    }

    // Setup auto refresh
    setupAutoRefresh() {
        // Refresh every 30 seconds để kiểm tra ảnh mới
        setInterval(() => {
            this.checkForNewImages();
        }, 30000);
        
        // Also refresh when window gains focus
        window.addEventListener('focus', () => {
            this.checkForNewImages();
        });
    }

    // Kiểm tra ảnh mới
    async checkForNewImages() {
        try {
            const response = await fetch(`https://res.cloudinary.com/${this.cloudName}/image/list/${this.folder}.json`);
            
            if (!response.ok) {
                return;
            }
            
            const data = await response.json();
            const images = data.resources || [];
            
            // Kiểm tra ảnh mới
            let newImagesCount = 0;
            images.forEach(image => {
                if (!this.knownImages.has(image.public_id)) {
                    this.addImageToGallery(
                        image.secure_url,
                        image.context?.category || 'wv',
                        image.tags || image.public_id,
                        image.public_id
                    );
                    newImagesCount++;
                }
            });
            
            if (newImagesCount > 0) {
                console.log(`🆕 Found ${newImagesCount} new images`);
                this.showNotification(`Đã cập nhật ${newImagesCount} ảnh mới!`);
            }
            
        } catch (error) {
            console.error('Error checking for new images:', error);
        }
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cloudinary-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add new image (called from upload widget)
    addNewImage(imageUrl, category, tags, fileName) {
        this.addImageToGallery(imageUrl, category, tags, fileName);
        console.log('🆕 Added new image to gallery');
    }
}

// Initialize Cloudinary Gallery
const cloudinaryGallery = new CloudinaryGalleryRealtime();

// Make it globally available
window.cloudinaryGallery = cloudinaryGallery;
