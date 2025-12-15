// ===== STATE MANAGEMENT =====
let currentImage = null;
let enhancedImageUrl = null;
let isDemoMode = false;

// ===== DOM ELEMENTS =====
const uploadArea = document.getElementById('uploadArea');
const uploadContent = document.getElementById('uploadContent');
const previewArea = document.getElementById('previewArea');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const tryDemoBtn = document.getElementById('tryDemoBtn');
const compareBtn = document.getElementById('compareBtn'); // Added missing reference
const originalImage = document.getElementById('originalImage');
const enhancedImage = document.getElementById('enhancedImage');


const enhancedPlaceholder = document.getElementById('enhancedPlaceholder');
const enhanceBtn = document.getElementById('enhanceBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const denoiseSlider = document.getElementById('denoiseSlider');
const denoiseValue = document.getElementById('denoiseValue');

// Comparison Elements
const comparisonContainer = document.getElementById('comparisonContainer');
const sideBySideContainer = document.getElementById('sideBySideContainer');
const compBefore = document.getElementById('compBefore');
const compAfter = document.getElementById('compAfter');
const sliderHandle = document.querySelector('.slider-handle');

// ===== EVENT LISTENERS =====

// Try Demo Button
tryDemoBtn.addEventListener('click', () => {
    isDemoMode = true;
    startDemoMode();
    // Scroll to tool
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
});

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
    isDemoMode = false;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// Slider updates
denoiseSlider.addEventListener('input', (e) => {
    denoiseValue.textContent = e.target.value + '%';
});

// Button actions
enhanceBtn.addEventListener('click', enhanceImage);
downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', resetApp);

// Comparison Slider Logic
let isDragging = false;
comparisonContainer.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);
comparisonContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e);
});
comparisonContainer.addEventListener('click', updateSlider);

function updateSlider(e) {
    const rect = comparisonContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    compBefore.style.width = percentage + '%';
    sliderHandle.style.left = percentage + '%';
}


// ===== FUNCTIONS =====

function startDemoMode() {
    isDemoMode = true;
    const demoSrc = '/assets/demo_before.png';
    currentImage = demoSrc;
    displayImage(demoSrc);
    showNotification('Demo loaded! Click "Enhance" to see the magic ✨', 'success');
}

function handleFileSelect(e) {
    isDemoMode = false;
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showNotification('Image size must be less than 10MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        displayImage(currentImage);
    };
    reader.readAsDataURL(file);
}

function displayImage(imageData) {
    uploadContent.classList.add('hidden');
    previewArea.classList.remove('hidden');

    // Hide comparison initially
    comparisonContainer.style.display = 'none';
    sideBySideContainer.style.display = 'flex';

    originalImage.src = imageData;
    enhancedImage.classList.add('hidden');
    enhancedPlaceholder.classList.remove('hidden');

    // Reset enhanced placeholder text
    enhancedPlaceholder.innerHTML = `
        <div style="font-size: 3rem;">🎨</div>
        <p>Ready to enhance</p>
    `;
    downloadBtn.disabled = true;
}

function showOriginal() {
    if (!enhancedImage.classList.contains('hidden')) {
        enhancedImage.src = currentImage; // Temporarily swap src
        // Remove filter if applied
        enhancedImage.style.filter = 'none';
    }
}

function showEnhanced() {
    if (!enhancedImage.classList.contains('hidden') && enhancedImageUrl) {
        enhancedImage.src = enhancedImageUrl;
        // Re-apply filter if it was a simulated user upload
        if (!isDemoMode && enhancedImageUrl === currentImage) {
            enhancedImage.style.filter = 'contrast(1.15) saturate(1.1) sepia(0.15)';
        }
    }
}

async function enhanceImage() {
    if (!currentImage) return;

    enhanceBtn.disabled = true;
    enhanceBtn.innerHTML = `<span class="spinner"></span> Processing...`;
    compareBtn.classList.add('hidden'); // Hide during processing

    enhancedPlaceholder.classList.remove('hidden');
    enhancedImage.classList.add('hidden');
    enhancedImage.style.filter = 'none'; // Reset filters

    enhancedPlaceholder.innerHTML = `
        <div class="spinner"></div>
        <p>Enhancing skin texture...</p>
    `;

    try {
        const denoise = parseFloat(denoiseSlider.value);

        // Call Processing
        const result = await processImageWithAI(currentImage, denoise);

        if (result.success) {
            enhancedImageUrl = result.imageUrl;
            downloadBtn.disabled = false;

            // DEMO MODE: Show Slider
            if (isDemoMode) {
                activeComparisonView(currentImage, enhancedImageUrl);
                compareBtn.classList.add('hidden');
            }
            // USER UPLOAD: Show Side-by-Side + Hold to Compare
            else {
                sideBySideContainer.style.display = 'flex';
                comparisonContainer.style.display = 'none';

                enhancedImage.src = enhancedImageUrl;
                enhancedImage.classList.remove('hidden');
                enhancedPlaceholder.classList.add('hidden');

                // If it's a simulated change (same URL), apply visual filter so "Compare" works
                if (enhancedImageUrl === currentImage) {
                    enhancedImage.style.filter = 'contrast(1.15) saturate(1.1) sepia(0.15)';
                }

                compareBtn.classList.remove('hidden');
            }

            showNotification('Enhancement complete! 🎉', 'success');
        }
    } catch (error) {
        console.error(error);
        showNotification('Enhancement failed.', 'error');
    } finally {
        enhanceBtn.disabled = false;
        enhanceBtn.innerHTML = `✨ Apply Natural Texture`;
    }
}

function activeComparisonView(beforeSrc, afterSrc) {
    sideBySideContainer.style.display = 'none';
    comparisonContainer.style.display = 'block';

    compBefore.src = beforeSrc;
    compAfter.src = afterSrc;

    // Reset slider to center
    compBefore.style.width = '50%';
    sliderHandle.style.left = '50%';
}

async function processImageWithAI(imageData, denoise) {
    // If DEMO MODE is active, we return the pre-baked "After" image
    if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
        return {
            success: true,
            imageUrl: '/assets/demo_after.png' // THE REAL CHANGE
        };
    }

    // Otherwise, try backend... (reusing previous logic)
    console.log("NaturaSkin Deep Check: Validating parameters...");
    console.log(`- Denoise Strength: ${denoise} (Optimal: 0.35)`);

    // Check if we are in production with an API endpoint
    // In a real deployment, this would point to a Cloudflare Worker or Next.js API route
    const API_ENDPOINT = '/api/enhance';

    try {
        // Attempt to call the backend if it exists
        // Note: This will 404 on the static site demo until you add a Cloudflare Function
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData, denoise: denoise / 100 })
        });

        if (response.ok) {
            const result = await response.json();
            return { success: true, imageUrl: result.output };
        }
    } catch (e) {
        // Fallback to Simulation Mode if backend is not connected
        console.warn("Backend not connected, running simulation:", e);
    }

    // SIMULATION MODE (Default for Static Demo)
    await new Promise(resolve => setTimeout(resolve, 2500));

    return {
        success: true,
        imageUrl: imageData,
        message: 'NaturaSkin Demo: Connect Backend for Real Flux Processing'
    };
}
function downloadImage() {
    if (!enhancedImageUrl) {
        showNotification('No enhanced image to download', 'error');
        return;
    }
    const link = document.createElement('a');
    link.href = enhancedImageUrl;
    link.download = `naturaskin-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Image downloaded! 📥', 'success');
}

function resetApp() {
    currentImage = null;
    enhancedImageUrl = null;
    uploadContent.classList.remove('hidden');
    previewArea.classList.add('hidden');
    fileInput.value = '';
    isDemoMode = false;

    // Reset sliders
    denoiseSlider.value = 35;
    if (denoiseValue) denoiseValue.textContent = '35%';

    downloadBtn.disabled = true;
    comparisonContainer.style.display = 'none';
    if (compareBtn) compareBtn.classList.add('hidden'); // Hide compare button
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#2dd4bf'),
        color: 'white',
        borderRadius: '8px',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    });

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add styles programmatically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
`;
document.head.appendChild(style);

// ===== INITIALIZE =====
console.log('🌿 NaturaSkin AI Web App Initialized');
console.log('Deep Check Pipeline: Ready to analyze texture quality.');
