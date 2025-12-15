# Enhancor - AI Natural Skin Enhancement

Transform AI-generated or plastic-looking skin into natural, realistic texture. 100% free, powered by advanced AI.

## 🚀 Features

- ✨ **Realistic Skin Texture** - Adds authentic pores and natural variations
- 🔒 **Identity Preservation** - Maintains facial features and unique characteristics
- ⚡ **Lightning Fast** - Process images in seconds
- 🆓 **100% Free** - No costs, no subscriptions, no sign-up
- 🎨 **Advanced Controls** - Fine-tune denoise and CFG parameters
- 🔐 **Privacy First** - Images processed securely, never stored

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript with Vite
- **Hosting**: Cloudflare Pages
- **AI Backend**: ComfyUI Workflow (Enhancor Skin Fix)
- **Model**: Flux-based skin enhancement model

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment to Cloudflare Pages

### Option 1: Automatic Deployment (Recommended)

1. Push this repository to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click "Save and Deploy"

### Option 2: Direct Upload

```bash
# Build the project
npm run build

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist
```

## 🔧 Backend Setup (ComfyUI API)

To enable actual AI processing, you need to set up a ComfyUI backend:

### Option 1: Use Replicate API (Easiest)

1. Sign up at [Replicate](https://replicate.com/)
2. Get your API token
3. Add environment variable in Cloudflare Pages:
   - `REPLICATE_API_TOKEN`: Your Replicate API token

### Option 2: Self-Hosted ComfyUI

1. Deploy ComfyUI with the Enhancor workflow
2. Expose API endpoint (use ngrok or similar for testing)
3. Add environment variable:
   - `COMFYUI_API_URL`: Your ComfyUI API endpoint

### Option 3: Cloudflare Workers + RunPod

1. Deploy ComfyUI on RunPod
2. Create Cloudflare Worker to proxy requests
3. Configure worker route in Cloudflare Pages

## 📝 Environment Variables

Create a `.env` file for local development:

```env
# Optional: For actual AI processing
REPLICATE_API_TOKEN=your_token_here
COMFYUI_API_URL=https://your-comfyui-instance.com
```

## 🎨 Customization

### Adjust Default Parameters

Edit `main.js`:

```javascript
// Default denoise value (0.20 - 0.50)
denoiseSlider.value = 0.35;

// Default CFG value (0.7 - 2.0)
cfgSlider.value = 1.0;
```

### Change Color Scheme

Edit CSS variables in `style.css`:

```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --accent: #8b5cf6;
}
```

## 📊 Usage

1. **Upload Image**: Drag & drop or click to browse
2. **Adjust Settings**: Fine-tune denoise and CFG parameters
3. **Enhance**: Click "Enhance Skin" button
4. **Download**: Save your enhanced image

## 🔒 Privacy & Security

- Images are processed client-side when possible
- No images are stored on servers
- All processing is temporary and deleted immediately
- No user tracking or analytics

## 📄 License

MIT License - Free for personal and commercial use

## 🙏 Credits

- **Workflow**: [Enhancor Skin Fix](https://github.com/sirioberati/Enhancor-Skin-Fix-Experimental-Workflow)
- **Developer**: Munir Kabir
- **AI Model**: Sirioberati

## 🐛 Troubleshooting

### Images not processing?

- Check browser console for errors
- Ensure image is under 10MB
- Try different image format (JPG, PNG)

### Slow processing?

- Reduce image resolution before upload
- Check your internet connection
- Backend API might be under heavy load

## 🚀 Roadmap

- [ ] Batch processing support
- [ ] Before/after comparison slider
- [ ] Mobile app version
- [ ] API for developers
- [ ] Custom model training

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ by Munir Kabir**
