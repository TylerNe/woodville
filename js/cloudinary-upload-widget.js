// Cloudinary Upload Widget for GitHub Pages
class CloudinaryUploadWidget {
    constructor() {
        this.cloudName = 'dqnwatzbo';
        this.uploadPreset = 'woodville';
        this.widget = null;
        this.init();
    }

    init() {
        // Load Cloudinary Upload Widget script
        this.loadScript();
        
        // Setup upload button
        this.setupUploadButton();
    }

    // Load Cloudinary script
    loadScript() {
        if (document.querySelector('script[src*="cloudinary"]')) {
            return; // Script already loaded
        }

        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.onload = () => {
            console.log('✅ Cloudinary Upload Widget loaded');
            this.createWidget();
        };
        document.head.appendChild(script);
    }

    // Create upload widget
    createWidget() {
        this.widget = cloudinary.createUploadWidget({
            cloudName: this.cloudName,
            uploadPreset: this.uploadPreset,
            folder: 'woodville-gallery',
            sources: ['local', 'camera', 'url'],
            multiple: true,
            maxFiles: 10,
            maxFileSize: 10000000, // 10MB
            allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            styles: {
                palette: {
                    window: "#FFFFFF",
                    windowBorder: "#90A0B3",
                    tabIcon: "#0078FF",
                    menuIcons: "#5A616A",
                    textDark: "#000000",
                    textLight: "#FFFFFF",
                    link: "#0078FF",
                    action: "#FF620C",
                    inactiveTabIcon: "#0E2F5A",
                    error: "#F44235",
                    inProgress: "#0078FF",
                    complete: "#20B832",
                    sourceBg: "#E4EBF1"
                },
                fonts: {
                    default: null,
                    "'Fira Sans', sans-serif": {
                        url: "https://fonts.googleapis.com/css?family=Fira+Sans",
                        active: true
                    }
                }
            }
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                this.handleUploadSuccess(result);
            } else if (error) {
                this.handleUploadError(error);
            }
        });
    }

    // Setup upload button
    setupUploadButton() {
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadArea = document.getElementById('uploadArea');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                if (this.widget) {
                    this.widget.open();
                } else {
                    console.log('⏳ Widget not ready yet, please wait...');
                }
            });
        }

        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                if (this.widget) {
                    this.widget.open();
                }
            });
        }
    }

    // Handle upload success
    handleUploadSuccess(result) {
        console.log('✅ Upload successful:', result);
        
        const imageUrl = result.info.secure_url;
        const fileName = result.info.public_id.split('/').pop();
        const tags = result.info.tags ? result.info.tags.join(' ') : fileName;
        
        // Get category from widget context or default
        const category = this.getCategoryFromWidget() || 'wv';
        
        // Add to gallery
        if (window.cloudinaryGallery) {
            window.cloudinaryGallery.addNewImage(imageUrl, category, tags, fileName);
        }
        
        // Show success message
        this.showSuccessMessage(`Uploaded: ${fileName}`);
        
        // Update upload area
        this.updateUploadArea();
    }

    // Handle upload error
    handleUploadError(error) {
        console.error('❌ Upload error:', error);
        this.showErrorMessage(`Upload failed: ${error.message || 'Unknown error'}`);
    }

    // Get category from widget
    getCategoryFromWidget() {
        const categorySelect = document.getElementById('categorySelect');
        return categorySelect ? categorySelect.value : 'wv';
    }

    // Show success message
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'upload-success';
        successDiv.textContent = message;
        
        const uploadSection = document.querySelector('.upload-area').parentElement;
        uploadSection.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'upload-error';
        errorDiv.textContent = message;
        
        const uploadSection = document.querySelector('.upload-area').parentElement;
        uploadSection.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Update upload area
    updateUploadArea() {
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            const content = uploadArea.querySelector('.upload-content');
            if (content) {
                content.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Click to upload more images</p>
                `;
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CloudinaryUploadWidget();
});
