document.addEventListener("DOMContentLoaded", () => {
    const apiKeyForm = document.getElementById("apiKeyForm");
    const queryForm = document.getElementById("queryForm");
    const userInput = document.getElementById("userInput");
    const apiKeyInput = document.getElementById("apiKey");
    const output = document.getElementById("output");
    const clearApiKeyBtn = document.getElementById("clearApiKey");
    const saveApiKeyBtn = document.getElementById("saveApiKey");
    const apiKeySaved = document.getElementById("apiKeySaved");
    const querySection = document.getElementById("querySection");

    // Function to set cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to delete cookie
    function deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Function to show query section
    function showQuerySection() {
        querySection.style.display = 'block';
        apiKeyInput.style.display = 'none';
        document.querySelector('label[for="apiKey"]').style.display = 'none';
        saveApiKeyBtn.style.display = 'none';
        clearApiKeyBtn.style.display = 'inline-block';
        apiKeySaved.style.display = 'block';
    }

    // Function to hide query section
    function hideQuerySection() {
        querySection.style.display = 'none';
        apiKeyInput.style.display = 'block';
        document.querySelector('label[for="apiKey"]').style.display = 'block';
        saveApiKeyBtn.style.display = 'inline-block';
        clearApiKeyBtn.style.display = 'none';
        apiKeySaved.style.display = 'none';
    }

    // Check if API key exists in cookie and auto-fill
    const savedApiKey = getCookie('openai_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        showQuerySection();
    }

    // Handle save API key button click
    saveApiKeyBtn.addEventListener('click', () => {
        if (apiKeyInput.value.trim() === '') {
            alert('Please enter an API key');
            return;
        }
        setCookie('openai_api_key', apiKeyInput.value, 30); // Store for 30 days
        showQuerySection();
    });

    // Handle clear API key button click
    clearApiKeyBtn.addEventListener('click', () => {
        deleteCookie('openai_api_key');
        apiKeyInput.value = '';
        hideQuerySection();
    });

    queryForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        output.innerHTML = "⏳ Generating answer...";

        const formData = new FormData();
        formData.append('prompt', userInput.value);
        formData.append('OPENAI_API_KEY', apiKeyInput.value);
        formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

        try {
            const response = await fetch('/execute_query', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                output.innerHTML = `<pre>${data.output}</pre>`;
            } else {
                output.innerHTML = `<pre style="color: red;">Error: ${data.error}</pre>`;
            }
        } catch (error) {
            output.innerHTML = `<pre style="color: red;">Error: ${error.message}</pre>`;
        }
    });
});
