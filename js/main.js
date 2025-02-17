// Configuración de la API de OpenAI (OpenRouter)
const API_KEY = "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";  // Reemplaza con tu clave real
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
// Función para enviar la consulta del usuario a OpenAI
async function enviarMensaje() {
    const userInput = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const mensajeUsuario = userInput.value.trim();

    if (mensajeUsuario === "") return;

    // Mostrar mensaje del usuario en el chat
    chatbox.innerHTML += `<div class="mensaje usuario">${mensajeUsuario}</div>`;
    userInput.value = ""; // Limpiar el input

    // Mostrar indicador de carga
    const mensajeCarga = document.createElement("div");
    mensajeCarga.classList.add("mensaje", "bot");
    mensajeCarga.innerText = "Escribiendo...";
    chatbox.appendChild(mensajeCarga);
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen-turbo", // Modelo a utilizar
                messages: [{ role: "user", content: mensajeUsuario }]
            })
        });

        if (!response.ok) {
            throw new Error(`Error de red: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error("No se recibió una respuesta válida de la API.");
        }

        let respuestaBot = data.choices[0].message.content;

        // Detectar si la respuesta es código y formatearlo
        if (respuestaBot.includes("```")) {
            respuestaBot = `<pre><code>${respuestaBot.replace(/```/g, "").trim()}</code></pre>`;
        }

        // Reemplazar "Escribiendo..." con la respuesta real
        mensajeCarga.innerHTML = respuestaBot;
        chatbox.scrollTop = chatbox.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
        mensajeCarga.innerText = "Error al conectar con la API. Revisa la consola (F12).";
    }
}

// Permitir enviar mensaje con Enter
document.getElementById("userInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        enviarMensaje();
    }
});
document.getElementById("userInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        enviarMensaje();
    }
});
