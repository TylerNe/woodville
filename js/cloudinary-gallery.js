// Cloudinary Gallery Loader
class CloudinaryGallery {
    constructor() {
        this.cloudName = 'dqnwatzbo';
        this.folder = 'woodville-gallery';
        this.images = [];
        this.imageContainer = document.querySelector('.image-container');
        this.init();
    }

    async init() {
        await this.loadImagesFromCloudinary();
        this.renderImages();
        this.setupAutoRefresh();
    }

    // Load ảnh từ Cloudinary
    async loadImagesFromCloudinary() {
        try {
            console.log('🔄 Loading images from Cloudinary...');
            
            // Lấy danh sách ảnh từ Cloudinary API
            const response = await fetch(`https://res.cloudinary.com/${this.cloudName}/image/list/${this.folder}.json`);
            
            if (!response.ok) {
                throw new Error('Failed to load images from Cloudinary');
            }
            
            const data = await response.json();
            this.images = data.resources || [];
            
            console.log(`✅ Loaded ${this.images.length} images from Cloudinary`);
            
        } catch (error) {
            console.error('❌ Error loading images:', error);
            // Fallback to local images if Cloudinary fails
            this.loadLocalImages();
        }
    }

    // Load ảnh local (fallback)
    loadLocalImages() {
        console.log('📁 Loading local images as fallback...');
        const localImages = this.imageContainer.querySelectorAll('img[src^="images/"]');
        this.images = Array.from(localImages).map(img => ({
            public_id: img.src.split('/').pop().split('.')[0],
            secure_url: img.src,
            tags: img.getAttribute('data-search') || '',
            context: {
                category: img.getAttribute('data-cat') || 'wv'
            }
        }));
    }

    // Render ảnh vào gallery
    renderImages() {
        // Clear existing images
        this.imageContainer.innerHTML = '';
        
        // Add images from Cloudinary
        this.images.forEach(image => {
            this.addImageToGallery(
                image.secure_url,
                image.context?.category || 'wv',
                image.tags || image.public_id,
                image.public_id
            );
        });
        
        console.log(`🎨 Rendered ${this.images.length} images`);
    }

    // Thêm ảnh vào gallery
    addImageToGallery(imageUrl, category, tags, fileName) {
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
        // Refresh every 30 seconds
        setInterval(() => {
            this.refreshGallery();
        }, 30000);
        
        // Also refresh when window gains focus
        window.addEventListener('focus', () => {
            this.refreshGallery();
        });
    }

    // Refresh gallery
    async refreshGallery() {
        const currentCount = this.images.length;
        await this.loadImagesFromCloudinary();
        
        if (this.images.length > currentCount) {
            console.log(`🆕 Found ${this.images.length - currentCount} new images`);
            this.renderImages();
            this.showNotification(`Đã cập nhật ${this.images.length - currentCount} ảnh mới!`);
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

    // Add new image (called from upload.js)
    addNewImage(imageUrl, category, tags, fileName) {
        const newImage = {
            public_id: fileName,
            secure_url: imageUrl,
            tags: tags,
            context: {
                category: category
            }
        };
        
        this.images.push(newImage);
        this.addImageToGallery(imageUrl, category, tags, fileName);
        
        console.log('🆕 Added new image to gallery');
    }
}

// Initialize Cloudinary Gallery
const cloudinaryGallery = new CloudinaryGallery();

// Make it globally available for upload.js
window.cloudinaryGallery = cloudinaryGallery;
