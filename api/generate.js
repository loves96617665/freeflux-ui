<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Image Generator</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding: 2rem; }
        #controls { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 20px; }
        #prompt-input { flex-grow: 1; min-width: 300px; padding: 10px; }
        #model-select { padding: 10px; }
        button { padding: 10px 20px; }
        #image-container img { max-width: 512px; margin-top: 20px; border: 1px solid #ddd; }
        #loading { font-style: italic; color: #888; }
    </style>
</head>
<body>
    <h1>AI Image Generator</h1>
    <div id="controls">
        <!-- 模型選擇下拉選單 -->
        <select id="model-select">
            <option value="flux.1-schnell">flux.1-schnell</option>
            <option value="flux.1-dev">flux.1-dev</option>
            <option value="flux.1-krea-dev">flux.1-krea-dev</option>
            <option value="flux.1.1-pro">flux.1.1-pro</option>
            <option value="flux.1-kontext-pro">flux.1-kontext-pro</option>
        </select>
        <input type="text" id="prompt-input" placeholder="Enter a prompt...">
        <button id="generate-btn">Generate</button>
    </div>
    <div id="loading" style="display:none;">Generating, please wait...</div>
    <div id="image-container"></div>

    <script>
        const promptInput = document.getElementById('prompt-input');
        const modelSelect = document.getElementById('model-select'); // 獲取模型選擇元素
        const generateBtn = document.getElementById('generate-btn');
        const loadingDiv = document.getElementById('loading');
        const imageContainer = document.getElementById('image-container');

        generateBtn.addEventListener('click', async () => {
            const prompt = promptInput.value;
            const model = modelSelect.value; // 獲取選擇的模型

            if (!prompt) {
                alert('Please enter a prompt.');
                return;
            }

            loadingDiv.style.display = 'block';
            imageContainer.innerHTML = '';
            generateBtn.disabled = true;

            try {
                // 發送請求時，將模型和提示詞一起發送到後端
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, model: model }) // 在 body 中加入 model
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate image.');
                }

                const data = await response.json();
                
                const img = document.createElement('img');
                img.src = data.imageUrl;
                imageContainer.appendChild(img);

            } catch (error) {
                imageContainer.innerText = `Error: ${error.message}`;
            } finally {
                loadingDiv.style.display = 'none';
                generateBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
