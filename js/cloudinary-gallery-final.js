// Cloudinary Gallery Final - Real-time updates without JSON updates
class CloudinaryGalleryFinal {
    constructor() {
        this.cloudName = 'dqnwatzbo';
        this.folder = 'woodville-gallery';
        this.imageContainer = document.querySelector('.image-container');
        this.knownImages = new Set();
        this.init();
    }

    async init() {
        this.showLoading();
        
        // Load initial images
        await this.loadInitialImages();
        
        // Setup real-time updates
        this.setupRealTimeUpdates();
    }

    showLoading() {
        this.imageContainer.innerHTML = `
            <div class="gallery-loading">
                <i class="fas fa-spinner"></i>
                <p>Loading images from Cloudinary...</p>
            </div>
        `;
    }

    // Load initial images using a different approach
    async loadInitialImages() {
        try {
            console.log('🔄 Loading initial images...');
            
            // Use a different approach - load from a public URL
            const response = await fetch('https://api.cloudinary.com/v1_1/dqnwatzbo/resources/image?prefix=woodville-gallery&max_results=100', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa('563719699716119:VH1yC3of5_DL8TaY0Q5C1yw7Ijs')
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const images = data.resources || [];
                console.log(`✅ Loaded ${images.length} images from Cloudinary`);
                this.renderImages(images);
            } else {
                throw new Error('Failed to load images');
            }
            
        } catch (error) {
            console.error('❌ Error loading images:', error);
            // Fallback to local images
            this.loadLocalImages();
        }
    }

    loadLocalImages() {
        console.log('📁 Loading local images as fallback...');
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
        this.imageContainer.innerHTML = '';
        
        if (images.length === 0) {
            this.showNoImages();
            return;
        }
        
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

    addImageToGallery(imageUrl, category, tags, fileName) {
        if (this.knownImages.has(fileName)) {
            return;
        }
        
        this.knownImages.add(fileName);
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.setAttribute('data-cat', category);
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

    setupRealTimeUpdates() {
        // Check for new images every 30 seconds
        setInterval(() => {
            this.checkForNewImages();
        }, 30000);
        
        // Check when window gains focus
        window.addEventListener('focus', () => {
            this.checkForNewImages();
        });
        
        // Listen for upload widget events
        window.addEventListener('message', (event) => {
            if (event.data.type === 'cloudinary-upload-success') {
                this.handleNewUpload(event.data.image);
            }
        });
    }

    async checkForNewImages() {
        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dqnwatzbo/resources/image?prefix=woodville-gallery&max_results=100', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa('563719699716119:VH1yC3of5_DL8TaY0Q5C1yw7Ijs')
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const images = data.resources || [];
                
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
            }
            
        } catch (error) {
            console.error('Error checking for new images:', error);
        }
    }

    handleNewUpload(imageData) {
        this.addImageToGallery(
            imageData.secure_url,
            imageData.category || 'wv',
            imageData.tags || imageData.public_id,
            imageData.public_id
        );
        this.showNotification('Ảnh mới đã được thêm!');
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
        console.log('🆕 Added new image to gallery');
    }
}

// Initialize Cloudinary Gallery
const cloudinaryGallery = new CloudinaryGalleryFinal();

// Make it globally available
window.cloudinaryGallery = cloudinaryGallery;
