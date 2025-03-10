function actualizarReloj() {
    const ahora = new Date();
    let horas = ahora.getHours().toString().padStart(2, "0");
    let minutos = ahora.getMinutes().toString().padStart(2, "0");
    let segundos = ahora.getSeconds().toString().padStart(2, "0");
    
    document.getElementById("reloj").textContent = `${horas}:${minutos}:${segundos}`;
}

function obtenerClima(lat, lon) {
    const apiKey = '4d03231504ee82bd1bf26ea8c14a77e7'; // Reemplaza con tu API Key de OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
    
    console.log("Obteniendo clima de:", url); // 👀 Ver si la URL se genera bien
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Datos del clima recibidos:", data); // 👀 Ver la respuesta de la API

            if (!data.weather || data.weather.length === 0) {
                console.error("No se encontró información del clima");
                return;
            }

            const temperatura = data.main.temp;
            const descripcion = data.weather[0].description.toLowerCase();
            document.getElementById("clima").textContent = `Clima: ${descripcion}, ${temperatura}°C`;
            
            const horaActual = new Date().getHours();
            const esDeDia = horaActual >= 6 && horaActual < 18;
            
            console.log("Descripción del clima:", descripcion);
            console.log("Es de día?", esDeDia);

            const videosPorClima = {
                nublado: {
                    dia: "-PJ1iYzkW2M", // ID del video de nublado (día)
                    noche: "TWyWK6NFHvo" // ID del video de nublado (noche)
                },
                lluvia: {
                    dia: "GZ0tNw8_TXc", // ID del video de lluvia (día)
                    noche: "_6VomlptOxk" // ID del video de tormenta (noche)
                },
                despejado: {
                    dia: "QITySTfukH8", // ID del video de soleado (día)
                    noche: "v5uKOyUKsHA" // ID del video de noche despejada (noche)
                }
            };
            
            //clima actual
            const clima = descripcion.includes("nub") ? "nublado" :
                          descripcion.includes("lluvia") ? "lluvia" :
                          descripcion.includes("despejado") ? "despejado" : "default";
            
            const videoId = videosPorClima[clima] ? 
            (esDeDia ? videosPorClima[clima].dia : videosPorClima[clima].noche) :
            "QITySTfukH8"; // ID por defecto corresponde a un dia soleado con flores
            
            const videoFondo = document.getElementById("videoFondo");
            videoFondo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
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

setInterval(actualizarReloj, 1000);
actualizarReloj();
obtenerUbicacion();
