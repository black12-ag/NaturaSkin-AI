# How to Run Enhancor Skin Fix for Free (Google Colab)

If your local computer is too slow, you can use Google Colab to run the heavy AI part in the cloud for free.

### 1. Open Google Colab
Click this link to create a new notebook: [**New Colab Notebook**](https://colab.research.google.com/#create=true)

### 2. Enable GPU
Go to the menu: **Runtime** -> **Change runtime type** -> select **T4 GPU** -> **Save**.

### 3. Run the Setup Code
Copy and paste the following code into the code cell and click the **Play** button (▶️).
*Note: This will take about 5 minutes to install everything.*

```python
# --- INSTALLER START ---
import os, subprocess, threading, time

# 1. Install ComfyUI
if not os.path.exists("ComfyUI"):
  !git clone https://github.com/comfyanonymous/ComfyUI
  %cd ComfyUI
  !pip install -r requirements.txt
  !wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
  !dpkg -i cloudflared-linux-amd64.deb

# 2. Install Custom Nodes
%cd custom_nodes
if not os.path.exists("ComfyUI-Manager"):
  !git clone https://github.com/ltdrdata/ComfyUI-Manager.git
if not os.path.exists("comfyui-mxtoolkit"):
  !git clone https://github.com/SmirnovAlexander/comfyui-mxtoolkit
if not os.path.exists("comfyui-post-processing-nodes"):
  !git clone https://github.com/EllangoK/comfyui-post-processing-nodes
%cd ..

# 3. Download Enhancor Model (~2GB)
!mkdir -p models/checkpoints
!wget -c -O models/checkpoints/enhancor.safetensors https://huggingface.co/Sirioberati/enhancor_skin_fix/resolve/main/enhancor.safetensors

# 4. Start Server with Tunnel
def start_server():
  !python main.py --preview-method auto --enable-cors-header "*"

threading.Thread(target=start_server, daemon=True).start()

print("Waiting for server...")
time.sleep(15)
print("\n🔗 COPY THIS URL (look for trycloudflare.com):")
!cloudflared tunnel --url http://127.0.0.1:8188
# --- INSTALLER END ---
```

### 4. Connect the Web App
1.  Look at the output of the cell. You will see a URL like `https://funny-words.trycloudflare.com`.
2.  Copy that URL.
3.  Go to your **NaturaSkin Web App**.
4.  Toggle the **AI Engine** switch ON.
5.  Paste the URL into the **Server Address** box.
6.  Wait for the status to turn green/connected.

Now when you click "Enhance", the image will be sent to Google's powerful servers for processing!
