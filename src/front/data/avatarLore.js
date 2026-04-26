import { avatarData } from "./avatarData";

export function getAvatarLore(avatarId) {
  const avatar = avatarData.find(a => a.id === avatarId);

  if (!avatar) {
    return {
      title: "Operador desconocido",
      origin:
        "Los registros de ShadowMap no contienen datos fiables sobre esta identidad. Algunos mapas lo marcan como 'fuera de rango'."
    };
  }

  let origin = "";

  switch (avatar.nombre) {
    case "Elias Ward":
      origin = `
      Los mapas antiguos mencionan un enclave prohibido llamado “La Fosa de Elias”.
      Se dice que quienes caminan junto a él escuchan pasos adicionales, como si algo
      invisible siguiera su sombra. Algunos exploradores aseguran que Elias conoce rutas
      que no aparecen en ningún registro oficial, caminos que llevan a lugares donde la
      señal se distorsiona y el tiempo parece detenerse.`;
      break;

    case "L. Frank Doyle":
      origin = `
      L. Frank descifró un patrón espectral que no debía existir. Desde entonces,
      cada mapa que toca revela zonas muertas, regiones donde la realidad se dobla.
      Susurros digitales lo siguen, como si entidades atrapadas en viejas transmisiones
      intentaran comunicarse a través de él.`;
      break;

    case "Rhea Blackwood":
      origin = `
      Rhea regresó del Bosque de Blackwood con un mapa dibujado a mano que mostraba
      rutas imposibles. Los árboles parecían moverse a su alrededor, guiándola hacia
      un claro donde la luz no llegaba. Desde entonces, sus mapas vibran cuando se
      acercan a lugares encantados o malditos.`;
      break;

    case "Silas Crow":
      origin = `
      Silas fue encontrado en un búnker sellado con símbolos de contención. Los mapas
      cercanos a él muestran interferencias, como si una presencia antigua intentara
      manifestarse. Algunos creen que Silas es un faro para entidades atrapadas entre
      planos.`;
      break;

    case "Unit‑47 Echo":
      origin = `
      Unit‑47 registra coordenadas de misiones que nunca ocurrieron… o que aún no han
      sucedido. Sus sensores detectan actividad en zonas donde no debería haber vida.
      Los mapas que genera muestran estructuras fantasma, ciudades que desaparecieron
      hace siglos.`;
      break;

    default:
      origin = "Este operador mantiene su historial completamente clasificado.";
  }

  return {
    title: avatar.nombre,
    origin
  };
}
