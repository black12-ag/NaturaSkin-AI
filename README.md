# NaturaSkin AI

<div align="center">
  <img src="assets/logo.png" alt="NaturaSkin AI Logo" width="120" />
  <h1>NaturaSkin AI</h1>
  <p><strong>Authentic Skin Restoration for the AI Age</strong></p>

  [![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/black12-ag)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Developer](https://img.shields.io/badge/Developer-Munir%20Kabir-teal)](https://github.com/black12-ag)
  [![Live Demo](https://img.shields.io/badge/Live%20app-naturaskin--ai.pages.dev-success)](https://naturaskin-ai.pages.dev/)
</div>

---

**NaturaSkin AI** is a professional-grade web tool designed to fix the "plastic/glossy" look of AI-generated portraits. By injecting realistic micropores, texture, and natural imperfections using a specialized Flux-based pipeline, it transforms artificial faces into authentic, human-like images.

## 🧠 System Architecture

### 1. High-Level Data Flow

```mermaid
graph LR
    User([User]) -->|1. Upload Portrait| Web["Web Client <br/> (Vite/JS)"]
    Web -->|2. Pre-process| API{"API Gateway <br/> Cloudflare Functions"}
    API -->|3. Inference Req| Flux["Flux.1 AI Model <br/> (ComfyUI Backend)"]
    Flux -->|4. Texture Map| Refine[Enhancement Node]
    Refine -->|5. Image Result| API
    API -->|6. JSON Response| Web
    Web -->|7. Display/Download| User

    style Web fill:#2dd4bf,stroke:#0f766e,color:black
    style Flux fill:#f43f5e,stroke:#9f1239,color:white
```

### 2. Detailed Technical Workflow

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant S as Server (Worker)
    participant AI as AI Engine (Flux)
    
    C->>C: Validate Image (Size/Type)
    C->>C: Generate Preview Blob
    C->>S: POST /api/enhance {image, denoise: 0.35}
    
    Note over S, AI: Secure Handshake
    
    S->>AI: Queue Prompt (Skin_Fix_Workflow_v1)
    AI->>AI: Load Checkpoint (enhancor.safetensors)
    AI->>AI: Segment Face (Mask)
    AI->>AI: Apply Localized Noise Injection
    AI->>AI: KSampler (20 Steps, 0.35 Denoise)
    AI->>AI: VAE Decode
    
    AI-->>S: Return Base64 Image
    S-->>C: Response {success: true, url: "..."}
    
    C->>C: Update UI State
    C->>C: Enable Download Button
```

### 3. Local AI Bridge (Pro Mode)

This app can connect directly to your local ComfyUI instance for maximum power and privacy.

**Requirements:**
1.  **ComfyUI** installed and running.
2.  **Enhancor Workflow** loaded.
3.  **CORS Enabled**: Run ComfyUI with:
    ```bash
    python main.py --enable-cors-header "*"
    ```

**Workflow Setup:**
1.  Open ComfyUI.
2.  Load `skin_fix_workflow.json` (drag & drop).
3.  **Important**: Save the workflow as **API Format** (Enable Dev Mode Options in ComfyUI Settings -> Save (API Format)).
4.  Rename it to `workflow_template.json` and replace the file in `public/workflow_template.json`.

### 4. Free Cloud Mode (Google Colab) ☁️

If your computer is slow (e.g., Mac with 8GB RAM), you can run the AI engine on Google's free GPUs!

1.  **Open the Config Guide**: Read `FULL_COLAB_GUIDE.md`.
2.  **Click & Run**: Use our One-Click Colab link to start the backend.
3.  **Connect**: Copy the `trycloudflare.com` URL provided by the notebook.
4.  **Paste in App**: Toggle "AI Engine" and paste the URL into the "Server Address" box.

## 🚀 Live Demo

[Launch App on Cloudflare Pages](https://naturaskin-ai.pages.dev) 

## 🛠️ Technology Stack

- **Frontend**: Vite + Vanilla JS (Pure Performance)
- **Styling**: Custom CSS (Teal/Natural Theme)
- **AI Core**: ComfyUI Workflow (Flux Model based)
- **Hosting**: Cloudflare Pages (Static + Functions)

## 📦 Quick Start

```bash
# Clone the repository
git clone https://github.com/black12-ag/NaturaSkin-AI.git

# Install dependencies
npm install

# Run local server
npm run dev
```

## 🔒 Copyright & License

**Copyright © 2025 Munir Kabir**.
Licensed under the [MIT License](LICENSE).

**Repository**: [https://github.com/black12-ag/NaturaSkin-AI.git](https://github.com/black12-ag/NaturaSkin-AI.git)

This availability of this open source code is made possible by **Munir Kabir** and is free for personal and commercial use.
