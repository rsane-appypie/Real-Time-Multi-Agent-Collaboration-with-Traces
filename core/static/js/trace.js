document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("queryForm");
    const userInput = document.getElementById("userInput");
    const apiKeyInput = document.getElementById("apiKey");
    const output = document.getElementById("output");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        output.innerHTML = "⏳ Generating answer...";

        const formData = new FormData();
        formData.append('prompt', userInput.value);
        formData.append('OPENAI_API_KEY', apiKeyInput.value);
        formData.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

        try {
            const response = await fetch('/plan_trip', {
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
