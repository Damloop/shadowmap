// /src/front/data/avatarLore.js
import { avatarData } from "./avatarData";

export function getAvatarLore(avatarId) {
  const avatar = avatarData.find(a => a.id === avatarId);

  if (!avatar) {
    return {
      title: "Operador desconocido",
      origin:
        "Los registros centrales no contienen información sobre este individuo. Su señal aparece y desaparece sin patrón alguno.",
      src: "/avatar/avatar_elias.jpg",
      level: 1
    };
  }

  let origin = "";

  switch (avatar.nombre) {
    case "Elias":
      origin = `
      Elias trabajaba como técnico en la Zona 6 hasta que un apagón total lo dejó atrapado bajo tierra durante once horas. 
      Cuando lo encontraron, afirmaba haber visto perfectamente en la oscuridad. 
      Desde entonces, las cámaras térmicas registran una anomalía constante alrededor de su silueta, como si algo caminara con él.`;
      break;

    case "L. Frank":
      origin = `
      L. Frank era analista de señales. Una noche detectó un patrón espectral idéntico a un archivo prohibido de ShadowMap. 
      En lugar de reportarlo, lo siguió… y el patrón respondió. 
      Desde entonces, asegura que “algo” le devuelve la mirada cuando analiza el ruido blanco.`;
      break;

    case "Rhea":
      origin = `
      Rhea desapareció durante 72 horas en el Bosque de Blackwood. 
      Regresó con un mapa dibujado a mano que mostraba rutas que no existen en ningún registro oficial. 
      Las coordenadas coinciden con zonas donde la señal se distorsiona sin explicación.`;
      break;

    case "Silas":
      origin = `
      Silas fue encontrado en un búnker abandonado, rodeado de símbolos de contención. 
      No recuerda quién lo encerró ni por qué, pero su pulso se sincroniza con anomalías de Clase III. 
      ShadowMap lo vigila de cerca… aunque nadie se atreve a decírselo.`;
      break;

    case "Unit‑47":
      origin = `
      Unit‑47 fue reactivado accidentalmente durante una inspección rutinaria. 
      Sus registros estaban corruptos, pero su señal era perfecta. 
      Opera como si recordara misiones que nunca realizó… o que aún no han ocurrido.`;
      break;

    default:
      origin = "Este operador mantiene su historial completamente clasificado.";
  }

  // Nivel basado en estadísticas del avatar
  const level = Math.floor(
    (avatar.fuerza + avatar.rapidez + avatar.resistencia + avatar.inteligencia) / 2
  );

  return {
    title: avatar.nombre,
    origin,
    src: avatar.src,
    level
  };
}
