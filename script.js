document.addEventListener('DOMContentLoaded', function() {
    const relojContainer = document.getElementById('reloj');
    const cronometroContainer = document.getElementById('cronometro-container');
    const iniciarButton = document.getElementById('iniciar');
    const detenerButton = document.getElementById('detener');
    const resetearButton = document.getElementById('resetear');
    const tiempoDisplay = document.getElementById('tiempo');

    // Verificar si los elementos existen antes de agregar los event listeners
    if (iniciarButton && detenerButton && resetearButton && tiempoDisplay) {
        let tiempoCronometro;
        let minutos = 0;
        let segundos = 0;

        iniciarButton.addEventListener('click', function() {
            tiempoCronometro = setInterval(function() {
                segundos++;
                if (segundos >= 60) {
                    segundos = 0;
                    minutos++;
                }
                tiempoDisplay.textContent = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
            }, 1000);
        });

        detenerButton.addEventListener('click', function() {
            clearInterval(tiempoCronometro);
        });

        resetearButton.addEventListener('click', function() {
            clearInterval(tiempoCronometro);
            minutos = 0;
            segundos = 0;
            tiempoDisplay.textContent = "00:00";
        });
    }

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
                    videoUrl = esDeDia ? "mp4/nubes-dia.mp4" : "mp4/nubes-noche.mp4";
                } else if (descripcion.includes("lluv") || descripcion.includes("torm")) {
                    videoUrl = esDeDia ? "mp4/lluvia-dia.mp4" : "mp4/tormenta-noche.mp4";
                } else if (descripcion.includes("despejado") || descripcion.includes("soleado") || descripcion.includes("claro")) {
                    videoUrl = esDeDia ? "mp4/soleado.mp4" : "mp4/noche-despejado.mp4";
                } else {
                    videoUrl = esDeDia ? "mp4/lluvia-dia.mp4" : "mp4/noche-despejado.mp4";
                }

                sombraNumeros = esDeDia ? "gray" : "yellow";

                // Actualizar la sombra y el video de fondo
                reloj.style.boxShadow = `0 0 15px ${sombraNumeros}, 0 0 25px ${sombraNumeros}, 0 0 5px ${sombraNumeros}`;
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
