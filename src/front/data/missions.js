export const missions = [
  // ---------------------------------------------------------
  // 1) SENCILLAS — ACCIONES REALES + MIEDO LÓGICO
  // ---------------------------------------------------------
  {
    id: 1,
    name: "Última Señal",
    description:
      "Llega al punto marcado. Una vez allí, abre WhatsApp y revisa tu última conversación. Si ves un mensaje que no recuerdas haber enviado, toma una foto del lugar y vuelve a ShadowMap.",
    difficulty: "Fácil",
    locked: false,
    type: "reach_point",
    target: {
      latOffset: 0.0004,
      lngOffset: -0.0002,
      radius: 20
    }
  },

  {
    id: 2,
    name: "Reflejo Inesperado",
    description:
      "Acércate al punto indicado. Abre Instagram y toma una foto desde la cámara de la app. Si notas un reflejo o brillo extraño en la previsualización, vuelve a ShadowMap.",
    difficulty: "Fácil",
    locked: false,
    type: "reach_point",
    target: {
      latOffset: -0.0003,
      lngOffset: 0.0004,
      radius: 20
    }
  },

  {
    id: 3,
    name: "Rastro Desconocido",
    description:
      "En el punto marcado, busca físicamente algo fuera de lugar: un cartel, una marca en el suelo, un objeto extraño. Haz una foto y vuelve a ShadowMap. No siempre es el entorno el que cambia.",
    difficulty: "Fácil",
    locked: false,
    type: "reach_point",
    target: {
      latOffset: 0.0005,
      lngOffset: 0.0001,
      radius: 25
    }
  },

  // ---------------------------------------------------------
  // 2) MEDIAS — MIEDO PSICOLÓGICO + APPS + SENSORES
  // ---------------------------------------------------------
  {
    id: 4,
    name: "Conversación Fragmentada",
    description:
      "Camina hacia el punto marcado. Una vez allí, abre WhatsApp y graba un audio diciendo la hora exacta. Reprodúcelo. Si escuchas un desfase o eco extraño, toma una foto del lugar y vuelve a ShadowMap.",
    difficulty: "Media",
    locked: false,
    type: "compass_path",
    target: {
      latOffset: 0.0004,
      lngOffset: 0.0004,
      distance: 40
    }
  },

  {
    id: 5,
    name: "Presencia No Registrada",
    description:
      "Activa la cámara frontal desde Instagram o Facebook. Camina 10 segundos. Si la luz detrás de ti cambia sin motivo, tu móvil vibrará. Haz una foto del entorno sin girarte.",
    difficulty: "Media",
    locked: false,
    type: "front_camera_light"
  },

  // ---------------------------------------------------------
  // 3) DIFÍCIL — BLOQUEADA — MIEDO REALISTA + APPS + EXPLORACIÓN
  // ---------------------------------------------------------
  {
    id: 6,
    name: "La Publicación Ausente",
    description:
      "Tres puntos aparecerán en tu mapa. En uno de ellos deberás abrir Instagram o Facebook y revisar tu actividad reciente. Si encuentras una foto o interacción que no recuerdas haber hecho, toma una foto del lugar exacto donde estás. No todas las publicaciones deberían existir.",
    difficulty: "Difícil",
    locked: true,
    type: "multi_checkpoint",
    checkpoints: [
      { id: "A", latOffset: 0.0004, lngOffset: 0.0003 },
      { id: "B", latOffset: -0.0005, lngOffset: 0.0004 },
      { id: "C", latOffset: -0.0003, lngOffset: -0.0004 }
    ]
  }
];
