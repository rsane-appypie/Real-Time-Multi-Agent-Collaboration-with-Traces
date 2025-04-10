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

    // Configure marked options for better HTML rendering
    marked.setOptions({
        breaks: true,          // Convert line breaks to <br>
        gfm: true,             // Enable GitHub Flavored Markdown
        headerIds: true,       // Enable header IDs for linking
        mangle: false,         // Don't mangle header IDs
        smartLists: true,      // Use smarter list behavior
        smartypants: true,     // Use smart typography like quotes and dashes
        xhtml: false,          // Don't output XHTML compliant tags
        highlight: function(code, lang) {
            // Simple syntax highlighting
            if (lang === 'js' || lang === 'javascript') {
                code = code.replace(/\b(const|let|var|function|return|if|else|for|while)\b/g, 
                    '<span style="color: #569cd6;">$1</span>');
            }
            return code;
        }
    });

    // Function to enhance LaTeX-like expressions without MathJax
    function processLatexExpressions(text) {
        // Replace \(...\) with styled spans
        text = text.replace(/\\\(([^)]+)\\\)/g, '<span style="font-style: italic; color: #224B7A;">$1</span>');
        
        // Replace $...$ with styled spans
        text = text.replace(/\$([^$]+)\$/g, '<span style="font-style: italic; color: #224B7A;">$1</span>');
        
        // Replace \[...\] with styled divs
        text = text.replace(/\\\[([\s\S]*?)\\\]/g, 
            '<div style="text-align: center; padding: 8px; margin: 12px 0; font-style: italic; color: #224B7A; background-color: #f8f9fa; border-radius: 4px;">$1</div>');
        
        return text;
    }

    /**
     * Sets a cookie with the given name, value, and expiration days
     * @param {string} name - The name of the cookie
     * @param {string} value - The value to store in the cookie
     * @param {number} days - Number of days until the cookie expires
     */
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    /**
     * Retrieves the value of a cookie by its name
     * @param {string} name - The name of the cookie to retrieve
     * @returns {string|null} The cookie value or null if not found
     */
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

    /**
     * Deletes a cookie by setting its expiration date to the past
     * @param {string} name - The name of the cookie to delete
     */
    function deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    /**
     * Shows the query section and hides the API key input section
     */
    function showQuerySection() {
        querySection.style.display = 'block';
        apiKeyInput.style.display = 'none';
        document.querySelector('label[for="apiKey"]').style.display = 'none';
        saveApiKeyBtn.style.display = 'none';
        clearApiKeyBtn.style.display = 'inline-block';
        apiKeySaved.style.display = 'block';
    }

    /**
     * Hides the query section and shows the API key input section
     */
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
        output.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="loading"></div>
                <span>Generating answer...</span>
            </div>
        `;

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
                // Process LaTeX-like expressions first
                const processedText = processLatexExpressions(data.output);
                
                // Then render markdown to HTML
                const renderedMarkdown = marked.parse(processedText);
                
                // Set the HTML content
                output.innerHTML = renderedMarkdown;
                
                // Auto-scroll to top of output after loading
                output.scrollTop = 0;
            } else {
                output.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--danger-color);">
                        <span>❌</span>
                        <span>Error: ${data.error}</span>
                    </div>
                `;
            }
        } catch (error) {
            output.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--danger-color);">
                    <span>❌</span>
                    <span>Error: ${error.message}</span>
                </div>
            `;
        }
    });
});
