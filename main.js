// ===== STATE MANAGEMENT =====
let currentImage = null;
let enhancedImageUrl = null;

// ===== DOM ELEMENTS =====
const uploadArea = document.getElementById('uploadArea');
const uploadContent = document.getElementById('uploadContent');
const previewArea = document.getElementById('previewArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const originalImage = document.getElementById('originalImage');
const enhancedImage = document.getElementById('enhancedImage');
const enhancedPlaceholder = document.getElementById('enhancedPlaceholder');
const enhanceBtn = document.getElementById('enhanceBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const denoiseSlider = document.getElementById('denoiseSlider');
const cfgSlider = document.getElementById('cfgSlider');
const denoiseValue = document.getElementById('denoiseValue');
const cfgValue = document.getElementById('cfgValue');

// ===== EVENT LISTENERS =====

// Browse button click
browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// Upload area click
uploadContent.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', handleFileSelect);

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContent.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadContent.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContent.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// Slider updates
denoiseSlider.addEventListener('input', (e) => {
    denoiseValue.textContent = e.target.value;
});

cfgSlider.addEventListener('input', (e) => {
    cfgValue.textContent = e.target.value;
});

// Button actions
enhanceBtn.addEventListener('click', enhanceImage);
downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', resetApp);

// ===== FUNCTIONS =====

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('Image size must be less than 10MB', 'error');
        return;
    }
    
    // Read and display image
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        displayImage(currentImage);
    };
    reader.readAsDataURL(file);
}

function displayImage(imageData) {
    // Hide upload content, show preview
    uploadContent.classList.add('hidden');
    previewArea.classList.remove('hidden');
    
    // Set original image
    originalImage.src = imageData;
    
    // Reset enhanced image
    enhancedImage.classList.add('hidden');
    enhancedPlaceholder.classList.remove('hidden');
    enhancedPlaceholder.innerHTML = `
        <div style="font-size: 3rem;">🎨</div>
        <p>Ready to enhance</p>
    `;
    downloadBtn.disabled = true;
}

async function enhanceImage() {
    if (!currentImage) {
        showNotification('Please upload an image first', 'error');
        return;
    }
    
    // Show processing state
    enhanceBtn.disabled = true;
    enhanceBtn.innerHTML = `
        <div class="spinner" style="width: 20px; height: 20px; border-width: 3px;"></div>
        <span>Processing...</span>
    `;
    
    enhancedPlaceholder.classList.remove('hidden');
    enhancedImage.classList.add('hidden');
    enhancedPlaceholder.innerHTML = `
        <div class="spinner"></div>
        <p>Enhancing skin texture...</p>
        <p style="font-size: 0.875rem; color: var(--text-muted);">This may take 30-60 seconds</p>
    `;
    
    try {
        // Get parameters
        const denoise = parseFloat(denoiseSlider.value);
        const cfg = parseFloat(cfgSlider.value);
        
        // Call API (we'll implement this with a serverless function)
        const result = await processImageWithAI(currentImage, denoise, cfg);
        
        if (result.success) {
            enhancedImageUrl = result.imageUrl;
            enhancedImage.src = enhancedImageUrl;
            enhancedImage.classList.remove('hidden');
            enhancedPlaceholder.classList.add('hidden');
            downloadBtn.disabled = false;
            showNotification('Enhancement complete! 🎉', 'success');
        } else {
            throw new Error(result.error || 'Enhancement failed');
        }
    } catch (error) {
        console.error('Enhancement error:', error);
        showNotification('Enhancement failed. Please try again.', 'error');
        enhancedPlaceholder.innerHTML = `
            <div style="font-size: 3rem;">❌</div>
            <p>Enhancement failed</p>
            <p style="font-size: 0.875rem; color: var(--text-muted);">${error.message}</p>
        `;
    } finally {
        // Reset button state
        enhanceBtn.disabled = false;
        enhanceBtn.innerHTML = `
            <span class="btn-icon">✨</span>
            Enhance Skin
        `;
    }
}

async function processImageWithAI(imageData, denoise, cfg) {
    // For demo purposes, we'll simulate processing
    // In production, this would call a Cloudflare Worker that interfaces with ComfyUI API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, return a demo result (you'll replace this with actual API call)
    // This is a placeholder - the actual implementation will use ComfyUI backend
    return {
        success: true,
        imageUrl: imageData, // In demo, return same image
        message: 'Demo mode - Connect to ComfyUI backend for real processing'
    };
    
    /* PRODUCTION CODE (uncomment when backend is ready):
    try {
        const response = await fetch('/api/enhance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageData,
                denoise: denoise,
                cfg: cfg,
                steps: 30
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
    */
}

function downloadImage() {
    if (!enhancedImageUrl) {
        showNotification('No enhanced image to download', 'error');
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = enhancedImageUrl;
    link.download = `enhanced-skin-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Image downloaded! 📥', 'success');
}

function resetApp() {
    // Reset state
    currentImage = null;
    enhancedImageUrl = null;
    
    // Reset UI
    uploadContent.classList.remove('hidden');
    previewArea.classList.add('hidden');
    fileInput.value = '';
    
    // Reset sliders
    denoiseSlider.value = 0.35;
    cfgSlider.value = 1.0;
    denoiseValue.textContent = '0.35';
    cfgValue.textContent = '1.0';
    
    downloadBtn.disabled = true;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? 'var(--success)' : 
                   type === 'error' ? 'var(--error)' : 
                   'var(--primary)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease',
        fontWeight: '600'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== INITIALIZE =====
console.log('🎨 Enhancor Web App Initialized');
console.log('Ready to transform artificial skin into natural beauty!');
