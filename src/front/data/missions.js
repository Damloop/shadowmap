// /src/front/data/missions.js

export const missions = [
    // 3 FÁCILES
    {
        id: 1,
        name: "Farola Parpadeante",
        description: "Encuentra una farola que parpadee. Grábala en vídeo durante 10 segundos. Si el parpadeo cambia de ritmo cuando te acercas, revisa el vídeo con auriculares.",
        difficulty: "Fácil",
        locked: false
    },
    {
        id: 2,
        name: "Audio Fantasma",
        description: "Graba un audio diciendo tu nombre y la hora exacta. Reprodúcelo después de 5 minutos. Si escuchas un ruido que no recuerdas haber hecho, guarda el archivo.",
        difficulty: "Fácil",
        locked: false
    },
    {
        id: 3,
        name: "Mensaje No Entregado",
        description: "Escribe un mensaje a alguien diciendo 'Estoy llegando'. No lo envíes. Si recibes un mensaje relacionado sin haber enviado nada, captura pantalla inmediatamente.",
        difficulty: "Fácil",
        locked: false
    },

    // 2 MEDIAS
    {
        id: 4,
        name: "Eco en la Calle Vacía",
        description: "Busca una calle sin gente. Aplaude una vez y grábalo. Si el eco tarda demasiado o suena más veces de las que aplaudiste, sube el volumen y revisa el audio.",
        difficulty: "Media",
        locked: false
    },
    {
        id: 5,
        name: "Llamada Perdida",
        description: "Tu móvil vibrará sin notificación. Marca tu propio número. Si escuchas silencio irregular, pasos o respiración, cuelga sin hablar y anota la hora exacta.",
        difficulty: "Media",
        locked: false
    },

    // 1 DIFÍCIL
    {
        id: 6,
        name: "Red Inexistente",
        description: "Busca redes WiFi. Si aparece una sin nombre, intenta conectarte. Si te muestra coordenadas, un nombre extraño o un mensaje incompleto, captura la pantalla y no sigas la ubicación solo.",
        difficulty: "Difícil",
        locked: true
    }
];
