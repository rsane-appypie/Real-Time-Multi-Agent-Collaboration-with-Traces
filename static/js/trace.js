document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("queryForm");
    const userInput = document.getElementById("userInput");
    const output = document.getElementById("output");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        output.innerHTML = "⏳ Generating answer...";

        const response = await fetch(`/plan_trip?user_input=${encodeURIComponent(userInput.value)}`);
        const data = await response.json();

        output.innerHTML = `<pre>${data.output}</pre>`;
    });
});
