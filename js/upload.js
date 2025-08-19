// Cloudinary Upload Configuration
const CLOUDINARY_CONFIG = {
    cloud_name: 'dqnwatzbo',
    upload_preset: 'woodville', // Bạn cần tạo upload preset trong Cloudinary
    api_key: '563719699716119'
};

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const categorySelect = document.getElementById('categorySelect');
const searchTags = document.getElementById('searchTags');

let selectedFiles = [];

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
uploadBtn.addEventListener('click', uploadFiles);

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
        selectedFiles = imageFiles;
        updateUploadButton();
        showSelectedFiles();
    }
}

// File Selection Handler
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    selectedFiles = files;
    updateUploadButton();
    showSelectedFiles();
}

// Update Upload Button State
function updateUploadButton() {
    uploadBtn.disabled = selectedFiles.length === 0;
    if (selectedFiles.length > 0) {
        uploadBtn.innerHTML = `<i class="fas fa-upload"></i> Upload ${selectedFiles.length} image(s)`;
    } else {
        uploadBtn.innerHTML = `<i class="fas fa-upload"></i> Upload to Cloudinary`;
    }
}

// Show Selected Files
function showSelectedFiles() {
    const content = uploadArea.querySelector('.upload-content');
    if (selectedFiles.length > 0) {
        content.innerHTML = `
            <i class="fas fa-images"></i>
            <p>${selectedFiles.length} ảnh đã chọn</p>
            <small>${selectedFiles.map(f => f.name).join(', ')}</small>
        `;
    } else {
        content.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Kéo thả ảnh vào đây hoặc click để chọn</p>
        `;
    }
}

// Upload Files to Cloudinary
async function uploadFiles() {
    if (selectedFiles.length === 0) return;

    uploadBtn.disabled = true;
    uploadProgress.style.display = 'block';
    
    const category = categorySelect.value;
    const tags = searchTags.value.trim();
    
    let uploadedCount = 0;
    const totalFiles = selectedFiles.length;
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
            formData.append('folder', 'woodville-gallery');
            
            // Add tags if provided
            if (tags) {
                formData.append('tags', tags);
            }
            
            // Upload to Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Add image to gallery
            if (window.cloudinaryGallery) {
                window.cloudinaryGallery.addNewImage(result.secure_url, category, tags, file.name);
            } else {
                addImageToGallery(result.secure_url, category, tags, file.name);
            }
            
            uploadedCount++;
            updateProgress(uploadedCount, totalFiles);
            
        } catch (error) {
            console.error('Upload error:', error);
            showError(`Lỗi upload ${file.name}: ${error.message}`);
        }
    }
    
    // Reset after upload
    setTimeout(() => {
        resetUpload();
        showSuccess(`Đã upload thành công ${uploadedCount}/${totalFiles} ảnh!`);
    }, 1000);
}

// Update Progress Bar
function updateProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% (${current}/${total})`;
}

// Add Image to Gallery
function addImageToGallery(imageUrl, category, tags, fileName) {
    const imageContainer = document.querySelector('.image-container');
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
    
    imageContainer.appendChild(img);
}

// Reset Upload
function resetUpload() {
    selectedFiles = [];
    fileInput.value = '';
    uploadBtn.disabled = true;
    uploadProgress.style.display = 'none';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    showSelectedFiles();
    updateUploadButton();
}

// Show Success Message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'upload-success';
    successDiv.textContent = message;
    
    const uploadSection = uploadArea.parentElement;
    uploadSection.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show Error Message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'upload-error';
    errorDiv.textContent = message;
    
    const uploadSection = uploadArea.parentElement;
    uploadSection.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize
updateUploadButton();
