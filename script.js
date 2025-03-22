document.addEventListener('DOMContentLoaded', function() {
    

    // Reloj y clima en común (también para index.html)
    function actualizarReloj() {
        const reloj = document.getElementById("reloj");
        const ahora = new Date();
        let horas = ahora.getHours().toString().padStart(2, "0");
        let minutos = ahora.getMinutes().toString().padStart(2, "0");
        let segundos = ahora.getSeconds().toString().padStart(2, "0");

        reloj.textContent = `${horas}:${minutos}:${segundos}`;
    }

    function obtenerClima(lat, lon) {
        const apiKey = '4d03231504ee82bd1bf26ea8c14a77e7'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const descripcion = data.weather[0].description.toLowerCase();
                const temperatura = data.main.temp;
                document.getElementById("clima").textContent = `Clima: ${descripcion}, ${temperatura}°C`;
               
                const horaActual = new Date().getHours();
                const esDeDia = horaActual >= 6 && horaActual < 18;

                let videoUrl;
                let sombraNumeros;

                if (descripcion.includes("nub")) {
                    videoUrl = esDeDia ? "https://github.com/valeeochoa/digitalClock/releases/download/1.0/nubes-dia.mp4" : "https://github.com/valeeochoa/digitalClock/releases/download/1.0/nubes-noche.mp4";
                } else if (descripcion.includes("lluv") || descripcion.includes("torm")) {
                    videoUrl = esDeDia ? "https://github.com/valeeochoa/digitalClock/releases/download/1.0/lluvia-dia.mp4" : "https://github.com/valeeochoa/digitalClock/releases/download/1.0/tormenta-noche.mp4";
                } else if (descripcion.includes("despejado") || descripcion.includes("soleado") || descripcion.includes("claro")) {
                    videoUrl = esDeDia ? "https://github.com/valeeochoa/digitalClock/releases/download/1.0/soleado.mp4" : "https://github.com/valeeochoa/digitalClock/releases/download/1.0/noche-despejado.mp4";
                } else {
                    videoUrl = esDeDia ? "https://github.com/valeeochoa/digitalClock/releases/download/1.0/lluvia-dia.mp4" : "https://github.com/valeeochoa/digitalClock/releases/download/1.0/noche-despejado.mp4";
                }

                sombraNumeros = esDeDia ? "gray" : "black";

                // Actualizar la sombra y el video de fondo
                reloj.style.textShadow = `2px 2px 10px ${sombraNumeros}, 0 0 25px ${sombraNumeros}, 0 0 5px ${sombraNumeros}`;

                const videoFondo = document.getElementById("videoFondo");
                const sourceVideo = videoFondo.querySelector("source");
                sourceVideo.src = videoUrl;
                videoFondo.load();
            })
            .catch(error => console.error("Error obteniendo el clima", error));
    }

    function obtenerUbicacion() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => obtenerClima(position.coords.latitude, position.coords.longitude),
                error => console.error("Error obteniendo la ubicación", error)
            );
        } else {
            console.error("Geolocalización no soportada");
        }
    }

    // Llamadas comunes
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
    obtenerUbicacion();
});
