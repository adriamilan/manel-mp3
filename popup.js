document.addEventListener("DOMContentLoaded", () => {
  const urlElement = document.getElementById("url");
  const sendBtn = document.getElementById("sendBtn");

  // Obtener la URL de la pestaña actual
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabUrl = tabs[0].url;

    // Verificar si es una URL de YouTube
    if (currentTabUrl.includes("youtube.com/watch")) {
      urlElement.textContent = `Current URL: ${currentTabUrl}`;

      sendBtn.addEventListener("click", () => {
        enviarAAPI(currentTabUrl);
      });
    } else {
      urlElement.textContent = "Not a YouTube URL.";
    }
  });

  // Función para enviar la URL a la API
  async function enviarAAPI(url) {
    const apiUrl = `https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/?url=${encodeURIComponent(url)}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "ae1093e49bmshe168ffbfa7f749bp13fd22jsnac952c9d1bc1",
        "x-rapidapi-host": "youtube-mp3-downloader2.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(apiUrl, options);
      const result = await response.json();

      if (result.dlink) {
        // Mostrar el enlace de descarga
        crearEnlaceDeDescarga(result.dlink);
      } else {
        console.error(
          "Error: No se encontró el enlace de descarga en la respuesta."
        );
      }
    } catch (error) {
      console.error("Error al enviar la URL a la API:", error);
    }
  }

  // Crear un enlace de descarga dinámico
  function crearEnlaceDeDescarga(dlink) {
    const downloadLink = document.createElement("a");
    downloadLink.href = dlink;
    downloadLink.textContent = "Descargar MP3";
    downloadLink.download = true; // Esto indica que el archivo será descargado
    document.body.appendChild(downloadLink);
  }
});
