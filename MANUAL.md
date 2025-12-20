# NaturaSkin AI - Complete Usage Manual

This manual explains how to use the NaturaSkin AI Web App, specifically focusing on the AI Engine integration.

## 1. Overview
The web application works in two modes:
1.  **Demo Mode (Offline)**: Uses pre-processed images to simulate the effect. Works instantly, no backend required.
2.  **AI Engine Mode (Pro)**: Connects to a powerful GPU server to actually process user photos.

---

## 2. Setting up the AI Engine

Since AI image processing requires a powerful GPU (Graphics Card), it cannot run directly in the browser or on the free website hosting. You need a "Backend Server".

### Option A: Free Mode (Google Colab)
This is free but requires manual startup each session.

1.  **Start the Server**:
    *   Open the [Google Colab Notebook](https://colab.research.google.com/github/black12-ag/NaturaSkin-AI/blob/master/FREE_COMFYUI_COLAB.ipynb).
    *   Click the **Play** button (▶️) on the cell.
    *   Wait for setup (approx. 5 mins).
    *   When finished, look for the **Cloudflare Link** at the bottom (e.g., `https://random-words.trycloudflare.com`).

2.  **Verify the Connection** (Crucial Step):
    *   Copy that link.
    *   Paste it into a **new browser tab**.
    *   Click **"Visit Site"** or "Verify" to bypass the security screen.

3.  **Connect the App**:
    *   Go to your website: [https://naturaskin-ai.pages.dev](https://naturaskin-ai.pages.dev)
    *   Toggle **AI Engine** to **ON**.
    *   Paste the link into the **Server Address** box.
    *   Wait for the green **LINKED** badge.

### Option B: 24/7 Production Mode (Paid)
To remove the manual steps above, you must rent a dedicated server.

**Recommended Provider: Replicate.com**
*   **Cost**: Pays per image (~$0.02).
*   **Setup**:
    1.  Create an account on Replicate.com.
    2.  Add your credit card.
    3.  Hire a developer (or use this codebase) to switch the `comfyClient.js` to use the Replicate API instead of the ComfyUI API.
    4.  This allows the site to work 24/7 automatically.

**Alternative Provider: RunPod.io**
*   **Cost**: ~$20/month fixed.
*   **Setup**: Host the ComfyUI folder on a RunPod GPU instance. You get a permanent IP address to paste into the app once.

---

## 3. Deployment
The website is hosted on Cloudflare Pages.
*   **Source Code**: [GitHub Repository](https://github.com/black12-ag/NaturaSkin-AI)
*   **Live Site**: [https://naturaskin-ai.pages.dev](https://naturaskin-ai.pages.dev)

Any changes pushed to the `master` branch on GitHub are automatically deployed to the live site.

---

## 4. Deleting Local Files
If you have pushed all changes to GitHub, you safely delete the project from your local computer.
To restore it later, simply run:
```bash
git clone https://github.com/black12-ag/NaturaSkin-AI.git
```
