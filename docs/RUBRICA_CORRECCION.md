# Rúbrica de Evaluación — Proyecto Final Bootcamp

> **Proyecto:** ShadowMap (Fullstack React + Flask)
> **Propósito:** Esta rúbrica está pensada como una herramienta de aprendizaje. Sirve tanto para que tú te **autoevalúes** con honestidad como para que el profesor te **califique** con criterios claros y consistentes.
> **Escala:** Cada dimensión se evalúa en 4 niveles → **1 Inicial · 2 En desarrollo · 3 Competente · 4 Sobresaliente**.
> **Cálculo:** Nota final = Σ (nivel obtenido × peso de la dimensión) / 4. Resultado sobre 100.

---

## Resumen de dimensiones

| # | Dimensión | Peso |
|---|---|---|
| 1 | Estructura del proyecto y organización del código | 8 % |
| 2 | Calidad del frontend (React, componentes, hooks) | 15 % |
| 3 | Calidad del backend (Flask, modelos, rutas) | 15 % |
| 4 | Gestión de estado y comunicación frontend ↔ backend | 10 % |
| 5 | Seguridad (autenticación, autorización, secretos) | 15 % |
| 6 | Funcionalidad end-to-end (que las features funcionen completas) | 10 % |
| 7 | Git, control de versiones y documentación | 5 % |
| 8 | UX, accesibilidad y manejo de errores | 8 % |
| 9 | Pruebas y validación | 5 % |
| 10 | DevOps básico: variables de entorno, scripts, despliegue | 5 % |
| 11 | Originalidad, ambición técnica y diseño | 4 % |
| **Total** | | **100 %** |

> 💡 Una buena forma de leer esta rúbrica: cada nivel describe **dónde estás hoy**, no **cuánto vales**. Subir de nivel es una cuestión de pequeñas decisiones repetidas, no de talento.

---

## 1. Estructura del proyecto — 8 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Las carpetas se mezclan sin criterio claro y hay archivos huérfanos. Pueden aparecer copias duplicadas del mismo módulo. Cuesta saber dónde vive cada cosa. |
| **2 — En desarrollo** | Existe una separación clara entre `frontend` y `backend`, y entre vistas y componentes. Aún conviven sistemas paralelos (por ejemplo, dos stores o dos servicios de autenticación) que sería ideal unificar. |
| **3 — Competente** | Hay una sola fuente de verdad por responsabilidad: un store, un servicio de autenticación, un punto de entrada en el backend. No quedan archivos sin uso ni imports rotos. |
| **4 — Sobresaliente** | La estructura es modular, escalable y autoexplicativa. Un nuevo dev encuentra cualquier pieza del proyecto en menos de dos minutos. |

**Señales a revisar:** dos archivos haciendo lo mismo · `create_app()` duplicado con configuraciones distintas · módulos marcados como "desactivados temporalmente" · imports inconsistentes.

---

## 2. Calidad del frontend — 15 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Componentes muy grandes (>300 líneas), JSX con lógica de negocio entremezclada, `useEffect` con dependencias incorrectas y estilos inline poco consistentes. |
| **2 — En desarrollo** | Los componentes están razonablemente divididos. Uso correcto de `useState`/`useEffect`, con detalles a pulir (efectos sin cleanup, arrays de dependencias incompletos, mezcla de clases CSS con estilos inline). |
| **3 — Competente** | Componentes pequeños y reutilizables. Hooks bien aprovechados (`useMemo`, `useCallback` cuando aplica). Estilos en archivos dedicados. Props validadas con `PropTypes` o TypeScript. |
| **4 — Sobresaliente** | Componentes claramente separados por responsabilidad (presentación vs contenedor). Hooks personalizados que encapsulan lógica reutilizable (`useAuth`, `useGeolocation`, etc.). Sin lógica duplicada entre vistas. |

**Señales a revisar:** vistas que crecen más allá de 400 líneas · `// eslint-disable-next-line react-hooks/exhaustive-deps` sin comentario explicando por qué · creación de objetos pesados (iconos, configuraciones) dentro del render.

---

## 3. Calidad del backend — 15 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Un solo archivo concentra todas las rutas, sin Blueprints. Modelos relacionales poco definidos. Lógica de negocio dentro de las rutas. Manejo de errores escaso. |
| **2 — En desarrollo** | Blueprints separados. Modelos con relaciones básicas. Validación mínima (`if not field: return 400`). Aún quedan endpoints duplicados o referencias a atributos que no existen en el modelo. |
| **3 — Competente** | Blueprints coherentes con un prefix único. Modelos con `serialize()` consistente. Validación en todas las rutas POST/PUT. Códigos HTTP correctos (201, 204, 401 vs 403). Sin código muerto. |
| **4 — Sobresaliente** | Capa de servicios separada de las rutas (rutas delgadas, lógica en servicios). DTOs/schemas (Marshmallow, Pydantic). Manejo centralizado de excepciones. Logging estructurado en lugar de `print`. |

**Señales a revisar:** dos archivos definiendo el mismo endpoint · rutas que usan campos inexistentes en el modelo · `print()` para debug · tokens de prueba como `"fake-token"` que quedan en el código.

---

## 4. Gestión de estado y comunicación frontend ↔ backend — 10 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Cada componente hace su propio `fetch`. El token vive en varios lugares (localStorage, sessionStorage, store, context) sin sincronización. Las URLs del API están hardcoded en múltiples archivos. |
| **2 — En desarrollo** | Hay un store/context central, pero todavía conviven varios sistemas de estado. La URL del backend está centralizada. |
| **3 — Competente** | Una sola fuente de verdad para sesión y datos. Servicios de API en una capa dedicada. Manejo consistente de loading/error/success. URL del backend desde `import.meta.env`. |
| **4 — Sobresaliente** | Custom hooks o librerías de data fetching (React Query, SWR). Cache, invalidación y revalidación coordinadas. Tipos compartidos cuando aplica. |

**Señales a revisar:** dos implementaciones distintas del login en el mismo proyecto · llamar a `actions.X()` que no existe en el store · keys de localStorage distintas para el mismo dato en componentes diferentes.

---

## 5. Seguridad — 15 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Secretos hardcoded en el código (`JWT_SECRET_KEY = "..."`). Contraseñas en texto plano. CORS abierto con credenciales. Tokens "fake". |
| **2 — En desarrollo** | Contraseñas hasheadas y JWT real. Aún quedan detalles importantes: el secret puede estar en código, el CORS está demasiado abierto, o los endpoints no verifican **ownership** (un usuario logueado puede tocar recursos de otros). |
| **3 — Competente** | Secretos solo en variables de entorno. CORS restringido a orígenes conocidos. Cada endpoint que toca un recurso de usuario verifica `current_user_id == resource.user_id`. Tokens de recuperación tienen expiración. |
| **4 — Sobresaliente** | Rate limiting en login/registro/recover. Validación estricta de inputs. Refresh tokens. Headers de seguridad. Auditoría básica de eventos sensibles. |

**Señales a revisar:** `JWT_SECRET_KEY = "super-secret-key"` · CORS con `origins="*"` y `supports_credentials=True` a la vez (combinación inválida por spec) · `recovery_token` sin expiración · endpoints PUT/DELETE sin filtrar por `user_id`.

---

## 6. Funcionalidad end-to-end — 10 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Hay más de un flujo principal roto. Botones que no responden. Vistas que muestran errores en consola al cargar. |
| **2 — En desarrollo** | El flujo principal (registro → login → uso) funciona, pero algunas features secundarias están desconectadas del backend o solo guardan en localStorage. |
| **3 — Competente** | Todos los flujos descritos en el README funcionan en el navegador. Persistencia real en la base de datos. Edge cases básicos cubiertos. |
| **4 — Sobresaliente** | Manejo robusto de estados intermedios (loading, vacío, error, sin red). Recuperación elegante ante fallos. Los estados se mantienen entre recargas. |

**Cómo verificar:** levantar el proyecto, registrarse, iniciar sesión, crear un recurso, recargar la página, cerrar sesión, recuperar contraseña.

---

## 7. Git, control de versiones y documentación — 5 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Commits genéricos ("update", "fix", "030526B"). README mínimo. Sin `.env.example`. Faltan instrucciones de instalación. |
| **2 — En desarrollo** | Commits con mensaje descriptivo. README con descripción y comandos básicos. `.env.example` parcial. |
| **3 — Competente** | Historial limpio. README cubre: qué hace, cómo instalar, cómo levantar back y front, variables de entorno, estructura. `.env.example` completo. |
| **4 — Sobresaliente** | Convención de commits (Conventional Commits o similar). Branches por feature. PRs con descripción. README con arquitectura, decisiones de diseño y capturas. |

**Señales a revisar:** commits con nombre tipo hash (`030526B`) · `.env.example` que no menciona variables que el código realmente usa · README sin la sección de variables de entorno.

---

## 8. UX, accesibilidad y manejo de errores — 8 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | `alert()` y `confirm()` para todo. Errores genéricos. Sin estados de loading. Inputs sin labels asociados. Click handlers en `<span>`/`<div>`. |
| **2 — En desarrollo** | Mensajes de error específicos. Labels en formularios. Algunos estados de loading. Aún hay flujos confusos o navegación que rompe el contexto. |
| **3 — Competente** | Feedback visual para cada acción. Validación inline. Navegación por teclado. Contraste de color razonable. Inputs accesibles. |
| **4 — Sobresaliente** | Toasts/modals consistentes. ARIA labels donde aplica. Responsive de verdad (móvil/tablet/escritorio). Animaciones con `prefers-reduced-motion`. |

**Señales a revisar:** `alert("Misión completada")` · `<span onClick={...}>` para navegación · `console.error` como única señal de error.

---

## 9. Pruebas y validación — 5 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Sin pruebas. Sin linting configurado. Sin validación más allá del `required` HTML. |
| **2 — En desarrollo** | ESLint configurado. Validaciones básicas en backend. Validaciones manuales descritas en el README. |
| **3 — Competente** | Pruebas unitarias del backend (pytest) cubriendo modelos y rutas críticas. Validaciones con librería. Linting verde. |
| **4 — Sobresaliente** | Tests de frontend (RTL/Vitest) + integración del backend + CI configurado (GitHub Actions). Coverage > 60 % en lógica crítica. |

---

## 10. DevOps básico — 5 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Scripts a mano. URLs hardcoded. Levantar el proyecto requiere pelearse con el entorno. |
| **2 — En desarrollo** | Scripts en `package.json` y `Pipfile`. Configuración para un único entorno. `.env.example` parcial. |
| **3 — Competente** | Variables de entorno cubren todas las URLs/secretos. Scripts claros (`dev`, `build`, `start`). Configuración para `development` vs `production`. Despliegue funcionando. |
| **4 — Sobresaliente** | CI/CD funcionando. Migraciones automáticas. Healthcheck endpoint. Logs estructurados. Build reproducible. |

---

## 11. Originalidad, ambición técnica y diseño — 4 %

| Nivel | Criterios observables |
|---|---|
| **1 — Inicial** | Clon directo de un tutorial. Diseño genérico de Bootstrap por defecto. Tema sin identidad. |
| **2 — En desarrollo** | Idea propia. Estética cuidada en partes del proyecto. Algo de identidad visual. |
| **3 — Competente** | Concepto original. Identidad visual coherente en todas las vistas. Detalles cuidados (favicons, fuentes, paleta consistente). |
| **4 — Sobresaliente** | El proyecto cuenta una historia. Storytelling, narrativa y diseño refuerzan la experiencia. Detalles "wow" (animaciones, sonidos, microinteracciones) sin sacrificar usabilidad. |

---

## Cómo calcular la nota final

```
Nota (sobre 100) = Σ (nivel_obtenido × peso_dimensión) / 4
```

Ejemplo:
- Dimensión 1 (peso 8 %): nivel 2 → aporta `2 × 8 / 4 = 4`
- Dimensión 2 (peso 15 %): nivel 3 → aporta `3 × 15 / 4 = 11.25`
- ...
- Total: suma de todas las aportaciones → calificación final.

**Equivalencia orientativa:**
- < 50 → No aprobado (revisar y volver a presentar)
- 50–69 → Aprobado
- 70–84 → Notable
- 85–94 → Sobresaliente
- 95+ → Matrícula de honor

---

## Hoja de autoevaluación

> Antes de mirar la corrección del profesor, completa esta tabla con honestidad. Compararla luego con la calificación oficial te dará información valiosa sobre tu propio criterio técnico (que es justamente una de las cosas que el bootcamp busca desarrollar).

| Dimensión | Mi nivel (1–4) | Evidencia que justifica mi nivel |
|---|---|---|
| 1. Estructura | | |
| 2. Frontend | | |
| 3. Backend | | |
| 4. Estado / API | | |
| 5. Seguridad | | |
| 6. Funcionalidad | | |
| 7. Git / Docs | | |
| 8. UX | | |
| 9. Pruebas | | |
| 10. DevOps | | |
| 11. Originalidad | | |
