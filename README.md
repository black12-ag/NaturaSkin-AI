# NaturaSkin AI

<div align="center">
  <img src="assets/logo.png" alt="NaturaSkin AI Logo" width="120" />
  <h1>NaturaSkin AI</h1>
  <p><strong>Authentic Skin Restoration for the AI Age</strong></p>

  [![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/black12-ag)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Cloudflare Pages](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)](https://pages.cloudflare.com/)
</div>

---

**NaturaSkin AI** is a professional-grade web tool designed to fix the "plastic/glossy" look of AI-generated portraits. By injecting realistic micropores, texture, and natural imperfections using a specialized Flux-based pipeline, it transforms artificial faces into authentic, human-like images.

## 🧠 System Architecture

### Project Structure (Mermaid)

```mermaid
graph TD
    A[User Browser] -->|Upload image| B(NaturaSkin Web App)
    B -->|Preprocessing| C{Parameter Check}
    C -->|Denoise & CFG| D[Flux AI Core]
    D -->|Texture Injection| E[Film Grain Node]
    E -->|Enhancement| F[Final Output]
    F -->|Download| A
    
    style B fill:#2dd4bf,stroke:#0f766e,color:white
    style D fill:#f43f5e,stroke:#9f1239,color:white
```

### How the Web App Works

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web Interface
    participant E as Enhancement Engine
    
    U->>W: Uploads Portrait
    W->>W: Generates Preview
    U->>W: Adjusts Texture Strength (20-50%)
    U->>W: Clicks "Apply Natural Texture"
    W->>E: Sends Image Data + Params
    E->>E: Segment Skin Areas
    E->>E: Inject Flux Texture
    E-->>W: Returns Enhanced Image
    W->>U: Displays Result (Download Available)
```

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

User Code and Design Copyright © 2025 **black12-ag**.
Code released under the [MIT License](LICENSE).

This project is open source and available for personal and commercial use.
