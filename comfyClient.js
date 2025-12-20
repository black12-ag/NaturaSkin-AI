/**
 * ComfyClient
 * Handles communication with a local ComfyUI instance.
 */
export class ComfyClient {
    constructor(host = '127.0.0.1:8188') {
        this.updateAddress(host);
        this.clientId = crypto.randomUUID();
        this.socket = null;
    }

    updateAddress(inputAddress) {
        let host = inputAddress.replace(/^https?:\/\//, '').replace(/\/$/, '');
        let protocol = inputAddress.startsWith('https') ? 'https' : 'http';
        let wsProtocol = inputAddress.startsWith('https') ? 'wss' : 'ws';

        this.host = host;
        this.apiBase = `${protocol}://${host}`;
        this.wsBase = `${wsProtocol}://${host}`;
    }

    /**
     * Checks if the local ComfyUI server is reachable.
     */
    async connect() {
        try {
            const response = await fetch(`${this.apiBase}/system_stats`);
            if (response.ok) {
                this.initWebSocket();
                return true;
            }
        } catch (e) {
            console.warn('ComfyUI connection failed:', e);
        }
        return false;
    }

    initWebSocket() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.socket = new WebSocket(`${this.wsBase}/ws?clientId=${this.clientId}`);
        this.socket.onopen = () => console.log('Connected to ComfyUI WS');
        this.socket.onerror = (err) => console.error('ComfyUI WS Error:', err);
    }

    /**
     * Uploads an image to ComfyUI.
     */
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('overwrite', 'true');

        const response = await fetch(`${this.apiBase}/upload/image`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Image upload failed');
        return await response.json();
    }

    /**
     * Executes the workflow with the given parameters.
     * @param {Object} params - { denoise: number, cfg: number, inputImage: string }
     */
    async queuePrompt(params) {
        // Load the API workflow template
        // NOTE: This expects the "API Format" JSON, not the default "Save" JSON.
        // Users must save via "Save (API Format)" in ComfyUI.
        let workflow;
        try {
            const response = await fetch('/workflow_template.json');
            workflow = await response.json();
        } catch (e) {
            throw new Error('Could not load workflow_template.json');
        }

        // HEURISTIC CONVERSION: 
        // If the workflow has "nodes", it's likely the UI format. 
        // We really need the API format. For now, we'll try to patch known IDs if they exist in a flat structure,
        // or warn if we detect UI format.
        if (workflow.nodes) {
            console.warn("Loaded workflow is in UI Format. Trying to convert or find nodes...");
            // TODO: Add proper UI->API conversion or notify user.
            // For this implementation, we assume the user has replaced it with API format
            // OR we try to patch the specific "widgets_values" if we can match IDs.
            this.patchUiFormat(workflow, params);

            // NOTE: Sending UI format to /prompt usually fails. 
            // We'll throw an error instructions for the user.
            throw new Error('workflow_template.json is in UI Format. Please export "API Format" from ComfyUI and replace this file.');
        } else {
            // API Format (Flat dictionary of NodeID -> Node)
            this.patchApiFormat(workflow, params);
        }

        const payload = {
            prompt: workflow,
            client_id: this.clientId
        };

        const response = await fetch(`${this.apiBase}/prompt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to queue prompt');
        return await response.json();
    }

    /**
     * Patches the API Format workflow (the one we want).
     */
    patchApiFormat(workflow, params) {
        // Node IDs from analysis:
        // 294: Denoise Slider (mxSlider) -> inputs: { value: float } ??? No, mxSlider usually outputs.
        // If using API format, custom nodes like mxSlider might be compiled out or just set values.
        // Let's assume standard nodes for a moment or that we inject into the nodes READing these values.

        // Actually, in API format, if sliders are used, the target nodes refer to the slider node.
        // We can just set the slider node's value if it exists.

        // Denoise (ID 294)
        if (workflow['294'] && workflow['294'].inputs) {
            workflow['294'].inputs.value = params.denoise;
        }

        // CFG (ID 269)
        if (workflow['269'] && workflow['269'].inputs) {
            workflow['269'].inputs.value = params.cfg;
        }

        // Input Image (ID 584 - LoadImage)
        if (workflow['584'] && workflow['584'].inputs) {
            workflow['584'].inputs.image = params.inputImage;
        }

        // For Random Seed (Flux Model ID 131 or KSampler)
        // We should randomize seed to get new results
        // Finding KSampler... ID 131 is ModelSamplingFlux. 
        // Let's generate a random seed for ALL nodes that have a 'seed' input.
        for (const id in workflow) {
            if (workflow[id].inputs && workflow[id].inputs.seed !== undefined) {
                workflow[id].inputs.seed = Math.floor(Math.random() * 1000000000);
            }
        }
    }

    patchUiFormat(workflow, params) {
        // This is just for demonstration/debug if user didn't swap file.
        const denoiseNode = workflow.nodes.find(n => n.id === 294);
        if (denoiseNode) denoiseNode.widgets_values[0] = params.denoise;

        const cfgNode = workflow.nodes.find(n => n.id === 269);
        if (cfgNode) cfgNode.widgets_values[0] = params.cfg;
    }

    /**
     * Waits for the result image.
     */
    async getResult(promptId) {
        return new Promise((resolve, reject) => {
            // Simple polling for history
            const check = async () => {
                try {
                    const history = await fetch(`${this.apiBase}/history/${promptId}`).then(r => r.json());
                    if (history[promptId]) {
                        // Success! Find output images.
                        const outputs = history[promptId].outputs;
                        for (const nodeId in outputs) {
                            const images = outputs[nodeId].images;
                            if (images && images.length > 0) {
                                const img = images[0];
                                const url = `${this.apiBase}/view?filename=${img.filename}&subfolder=${img.subfolder}&type=${img.type}`;
                                resolve(url);
                                return;
                            }
                        }
                    }
                } catch (e) { }

                setTimeout(check, 1000);
            };
            check();
        });
    }
}
