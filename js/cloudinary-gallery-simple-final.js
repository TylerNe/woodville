// Cloudinary Gallery Simple Final - No server needed
class CloudinaryGallerySimpleFinal {
    constructor() {
        this.imageContainer = document.querySelector('.image-container');
        this.init();
    }

    init() {
        // Load images from local storage or show local images
        this.loadImages();
        
        // Setup upload widget integration
        this.setupUploadIntegration();
    }

    loadImages() {
        // Try to load from local storage first
        const savedImages = localStorage.getItem('woodville-images');
        
        if (savedImages) {
            try {
                const images = JSON.parse(savedImages);
                this.renderImages(images);
                console.log(`✅ Loaded ${images.length} images from local storage`);
                return;
            } catch (error) {
                console.error('Error loading from local storage:', error);
            }
        }
        
        // Fallback to local images in HTML
        this.loadLocalImages();
    }

    loadLocalImages() {
        console.log('📁 Loading local images from HTML...');
        const localImages = document.querySelectorAll('img[src^="images/"]');
        
        if (localImages.length > 0) {
            console.log(`📁 Found ${localImages.length} local images`);
            // Local images đã có sẵn trong HTML
        } else {
            this.showNoImages();
        }
    }

    showNoImages() {
        this.imageContainer.innerHTML = `
            <div class="gallery-loading">
                <i class="fas fa-images"></i>
                <p>No images found. Upload some images to get started!</p>
            </div>
        `;
    }

    renderImages(images) {
        // Clear container
        this.imageContainer.innerHTML = '';
        
        if (images.length === 0) {
            this.showNoImages();
            return;
        }
        
        // Add images
        images.forEach(image => {
            this.addImageToGallery(image.url, image.category, image.tags, image.name);
        });
        
        console.log(`🎨 Rendered ${images.length} images`);
    }

    addImageToGallery(imageUrl, category, tags, fileName) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.setAttribute('data-cat', category || 'wv');
        img.setAttribute('data-search', tags || fileName);
        img.alt = fileName;
        
        img.addEventListener('click', () => {
            const popup = document.querySelector('.image-popup');
            const popupImg = popup.querySelector('img');
            popupImg.src = imageUrl;
            popup.style.display = 'flex';
        });
        
        this.imageContainer.appendChild(img);
    }

    setupUploadIntegration() {
        // Listen for upload widget events
        window.addEventListener('message', (event) => {
            if (event.data.type === 'cloudinary-upload-success') {
                this.handleNewUpload(event.data.image);
            }
        });
    }

    handleNewUpload(imageData) {
        // Add to gallery immediately
        this.addImageToGallery(
            imageData.secure_url,
            imageData.category || 'wv',
            imageData.tags || imageData.public_id,
            imageData.public_id
        );
        
        // Save to local storage
        this.saveImageToStorage(imageData);
        
        // Show notification
        this.showNotification('Ảnh mới đã được thêm!');
    }

    saveImageToStorage(imageData) {
        try {
            const savedImages = localStorage.getItem('woodville-images');
            let images = savedImages ? JSON.parse(savedImages) : [];
            
            // Add new image
            images.push({
                name: imageData.public_id,
                url: imageData.secure_url,
                category: imageData.category || 'wv',
                tags: imageData.tags || imageData.public_id
            });
            
            // Save back to storage
            localStorage.setItem('woodville-images', JSON.stringify(images));
            
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

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
        
        // Save to storage
        this.saveImageToStorage({
            public_id: fileName,
            secure_url: imageUrl,
            category: category,
            tags: tags
        });
        
        console.log('🆕 Added new image to gallery');
    }
}

// Initialize Cloudinary Gallery
const cloudinaryGallery = new CloudinaryGallerySimpleFinal();

// Make it globally available
window.cloudinaryGallery = cloudinaryGallery;
