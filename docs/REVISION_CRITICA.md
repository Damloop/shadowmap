# Revisión formativa — ShadowMap

> 👋 Hola. Este documento es una revisión de tu proyecto **pensada para que aprendas**, no para que te desanimes. Hay cosas que están realmente bien, cosas que están a un paso de estarlo, y algunas que conviene revisar antes de mostrar el proyecto a un empleador.
>
> **Cómo leerlo:**
> 1. Empieza por **lo que está bien** — porque te lo has ganado.
> 2. Sigue con **lo que más impacto tiene si lo arreglas** — son los puntos con mejor relación esfuerzo/recompensa.
> 3. Después la **revisión por dimensiones** con ejemplos de tu propio código.
> 4. Al final tienes un **plan priorizado** y una **calificación de referencia**.
>
> Si algo no queda claro o no estás de acuerdo, perfecto — eso significa que vale la pena hablarlo en clase.

---

## 1. Lo que está bien

Antes de cualquier sugerencia, hay decisiones que tomaste correctamente y que merecen reconocimiento:

- 🔐 **Hash de contraseñas con `werkzeug.security`** (`routes_auth.py:28`, `routes.py:33`). Nunca guardaste contraseñas en texto plano — esto es lo mínimo no negociable y lo hiciste bien desde el principio.
- 🏗️ **Uso de Blueprints en Flask** — separaste `auth_api`, `routes_api`, `premium_api`, etc. Es la estructura correcta de un proyecto Flask serio.
- 🔗 **Modelos relacionales bien pensados** — la relación `Route` ↔ `RoutePoint` con `cascade="all, delete-orphan"` (`models.py:130-135`) demuestra que entiendes el ORM y los ciclos de vida.
- 🛡️ **Endpoints sensibles protegidos con `@jwt_required()`** — el decorador aparece donde debe.
- 🚪 **`ProtectedRoute` para rutas privadas en React** (`ProtectedRoute.jsx:7`) — es una pieza correcta de arquitectura.
- 🎨 **Identidad visual y narrativa** — el README, el theming, los nombres ("Ruta tenebrosa", "Misión activa"), los avatares con lore… esto es lo que diferencia un proyecto memorable de uno olvidable. **Esto es talento real, no se enseña.**

> Cuando termines de revisar las mejoras, vuelve a esta sección. Te va a recordar de dónde partes.

---

## 2. Lo que más impacto tiene si lo arreglas

Estas son las observaciones con la mejor relación esfuerzo/beneficio. La mayoría se pueden resolver en pocas horas y suben significativamente la calidad percibida del proyecto.

### 2.1 Hay dos aplicaciones Flask configuradas y solo una se usa

En `src/api/__init__.py` defines un `create_app()`:

```python
# src/api/__init__.py:18
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shadowmap.db"
...
from src.api.routes import api
app.register_blueprint(api, url_prefix="/api")
```

Y en `src/api/app.py` defines otro `create_app()` distinto:

```python
# src/api/app.py:26
DB_PATH = os.path.join(BASE_DIR, "instance", "database.db")
...
app.register_blueprint(auth_api, url_prefix="/api")
app.register_blueprint(routes_api, url_prefix="/api")
# ...8 blueprints más
```

Apuntan a bases de datos distintas y registran blueprints distintos. Probablemente uno fue tu primer intento y el otro tu versión definitiva. Te sugiero **quedarte con `app.py`** (el más completo) y borrar `__init__.py` como factory, dejando solo lo necesario para que `src/api/` siga siendo un paquete.

### 2.2 `routes.py` define endpoints de login con un token de prueba

```python
# src/api/routes.py:58
return jsonify({
    "token": "fake-token",
    "user": user.serialize()
}), 200
```

Este archivo **no se registra** en `app.py`, así que en la práctica no se ejecuta. Pero el problema es que si alguien (tú mismo en una semana) lo registra por accidente, se pierde la autenticación real. La buena implementación ya la tienes en `routes_auth.py`, así que esta puedes borrarla con tranquilidad.

### 2.3 La activación de Premium falla en tiempo de ejecución

```python
# src/api/routes_premium.py:21
user.is_premium = True
```

El campo `is_premium` no está definido en tu modelo `User` (`models.py:11-33`). Cuando un usuario haga clic en "Activar Premium", el backend lanzará `AttributeError`. La buena noticia es que la solución es muy directa:

1. Añade el campo al modelo:
   ```python
   is_premium = db.Column(db.Boolean, default=False, nullable=False)
   ```
2. Crea la migración con Flask-Migrate.
3. Borra `src/api/premium.py` (es un duplicado con un import roto: usa `from api.models` en lugar de `from src.api.models`).

### 2.4 Algunas acciones que el frontend llama no existen aún

En estas vistas se invocan acciones que no están definidas:

- `addPlace.jsx:26` → `actions.createPlace(...)`
- `editPlace.jsx:48` → `actions.updatePlace(...)`
- `placeDetails.jsx:30` → `actions.deletePlace(...)`
- `RouteCreator.jsx:16` → `actions.publishRoute(...)`

Cuando se ejecutan, fallan silenciosamente porque `actions.createPlace` es `undefined`. Tienes dos caminos válidos:

- **Camino A (terminar lo empezado):** implementa estas acciones en `flux.js` siguiendo el mismo patrón que `login` o `saveRouteLocal`.
- **Camino B (alcance honesto):** si no entran en el scope de la entrega, retira temporalmente las vistas del router en `layout.jsx`. Es mejor tener menos features y que funcionen, que más features rotas.

Cualquiera de los dos caminos es perfectamente legítimo. Lo que no recomiendo es dejarlo así.

### 2.5 Conviven dos sistemas de autenticación

- `src/context/AuthContext.jsx` + `src/services/authService.js` (basado en Context + hooks personalizados).
- `src/front/js/store/appContext.jsx` + `src/front/js/store/flux.js` (el patrón Flux de 4Geeks).

Ambos definen `token`, `user`, `login`, `logout`… pero **el proyecto solo usa el segundo**. El primero está huérfano. Esto se nota cuando un compañero (o tú mismo en seis meses) intenta entender qué pieza es la autoridad. **Mi recomendación:** elige uno y borra el otro. El de Flux ya está integrado en toda la app, así que probablemente el más rápido es borrar `AuthContext` y `authService`.

> Nota: a futuro, si vas a proyectos profesionales, el patrón de Context + hooks (que tenías en `AuthContext.jsx`) suele ser más moderno y limpio que Flux. Tu intuición al crearlo iba bien encaminada.

### 2.6 `JWT_SECRET_KEY` está hardcoded

```python
# src/api/app.py:30
app.config["JWT_SECRET_KEY"] = "super-secret-key"
```

Cualquiera con acceso al repo puede forjar tokens válidos para cualquier usuario. Esto es lo que conviene cambiar primero:

```python
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
```

Y añade la variable a `.env.example`. Es un cambio de 30 segundos que pasa la dimensión de seguridad de nivel 1 a nivel 2.

### 2.7 La configuración de CORS no es del todo correcta

```python
# src/api/app.py:35
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, ...)
```

La especificación CORS **prohíbe** la combinación `origins="*"` + `supports_credentials=True`. Hoy "funciona" porque tu frontend no envía cookies, pero el día que añadas algo con credenciales se va a romper de forma misteriosa. Mejor sé explícito:

```python
CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:3000",
        os.getenv("FRONTEND_URL"),
    ]}},
    supports_credentials=True,
)
```

### 2.8 Falta verificación de ownership en operaciones sensibles

Ejemplo en POIs:

```python
# src/api/routes_pois.py:65
@pois_api.route("/pois/<int:poi_id>", methods=["PUT"])
@jwt_required()
def update_poi(poi_id):
    poi = POI.query.get(poi_id)
    if not poi:
        return jsonify({"message": "POI no encontrado"}), 404
    # ...
```

El decorador `@jwt_required()` se asegura de que el usuario esté autenticado, pero no de que sea **dueño** del recurso. Hoy cualquier usuario logueado puede modificar/borrar cualquier POI del sistema. Lo mismo pasa en `routes_premium.py` (UPDATE/DELETE de rutas premium ajenas) y `routes_routes.py` (compartir cualquier ruta).

**Para arreglarlo necesitas:**
1. Añadir `user_id` al modelo (POI, Place, etc.) si va a haber dueños.
2. En cada PUT/DELETE/SHARE, verificar:
   ```python
   if resource.user_id != get_jwt_identity():
       return jsonify({"message": "No autorizado"}), 403
   ```

Esta es una de las críticas de seguridad más típicas en proyectos junior — arreglarla en este proyecto va a quedarse contigo para siempre.

### 2.9 El token de recuperación de contraseña no expira

```python
# src/api/routes_recover.py:20
token = secrets.token_urlsafe(32)
user.recovery_token = token
```

Generaste un token criptográficamente seguro, lo cual está perfecto. Pero le falta una fecha de expiración. Si alguien intercepta ese email una vez, puede usar el token semanas después. Te sugiero:

```python
user.recovery_token = token
user.recovery_token_expires_at = datetime.utcnow() + timedelta(minutes=15)
```

Y validar en `reset_password` que la fecha no haya pasado.

### 2.10 El link del email no coincide con la ruta del frontend

```python
# src/api/routes_recover.py:24
reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password/{token}"
```

Pero en `layout.jsx:58`:

```jsx
<Route path="/reset-password" element={<ResetPassword />} />
```

El email lleva al usuario a `/reset-password/abc123` y tu router solo conoce `/reset-password`. El usuario hace clic y aterriza en una página "Not found". Hay dos formas de arreglarlo:

- **Opción A (recomendada):** cambia la ruta del router a `/reset-password/:token` (ya estás leyendo el `token` con `useParams()` en `resetPassword.jsx:9`, así que esto va a funcionar inmediatamente).
- **Opción B:** cambia el email para usar `?token=...` y léelo con `useSearchParams`.

---

## 3. Revisión por dimensiones

### Dimensión 1 — Estructura · Nivel 2

**Lo que está bien:** separación clara entre `src/api` y `src/front`. Carpetas `views/`, `component/`, `store/`, `styles/`.

**Pequeñas mejoras:**
- Unifica los sistemas de auth (ver 2.5).
- Decide un solo `create_app()` (ver 2.1).
- En `src/api/routes_places.py` el comentario dice "El módulo de Places está desactivado temporalmente (falta el modelo Place)" pero `Place` **sí existe** en `models.py:40`. Probablemente arrastras un comentario antiguo — actualízalo o borra el archivo.
- `src/api/premium.py` parece una versión vieja de `routes_premium.py` con un import roto. Se puede eliminar.

**Para llegar a nivel 3:** una sola fuente por responsabilidad y cero archivos huérfanos.

---

### Dimensión 2 — Frontend · Nivel 2

**Lo que está bien:** uso correcto de `useState`/`useEffect`/`useContext`. Vistas separadas. Componentes razonablemente pequeños (con una excepción).

**Áreas a pulir:**

1. **`map.jsx` se ha hecho grande** (405 líneas). Mezcla lógica de misión, creación de rutas, dos modales y lista de rutas guardadas. Sugerencia amable: extraer `MissionPanel`, `RouteCreatorPanel` y `SavedRoutesPanel` te va a dar un componente principal mucho más legible.

2. **`MapView.jsx:18` crea el icono en cada render:**
   ```js
   const missionIcon = L.divIcon({ ... });
   ```
   El icono no depende de props ni de state, así que lo ideal es sacarlo fuera del componente o envolverlo en `useMemo`. Es un detalle, pero refleja atención a la inmutabilidad.

3. **Estilos inline y clases CSS conviven en el mismo archivo.** Por ejemplo, en `map.jsx:204` tienes:
   ```jsx
   style={{ background: "#1b1f2a", padding: 8, borderRadius: 6, ... }}
   ```
   Y al lado usas la clase `shadow-btn`. Cualquiera de las dos opciones es válida; lo importante es ser consistente. Para piezas reutilizables, las clases CSS escalan mejor.

4. **Eventos en `<span>` sin accesibilidad:**
   ```jsx
   // src/front/js/views/login.jsx:72
   <span className="login-link-left" onClick={() => navigate("/register")}>
       Regístrate
   </span>
   ```
   Esto no es navegable por teclado y no tiene rol semántico. Lo más limpio es usar `<Link>` de React Router o un `<button>`. Mejora la accesibilidad sin tocar el diseño.

5. **`alert()` y `confirm()` para feedback:**
   ```js
   // src/front/js/store/flux.js:233
   alert("Misión completada");
   ```
   Funcionan, pero bloquean el hilo y rompen el estilo cinematográfico que tanto cuidaste en el resto del proyecto. Un toast o modal propio encaja mucho mejor con la estética ShadowMap.

6. **`useEffect` con `// eslint-disable-next-line react-hooks/exhaustive-deps`:** silenciar la regla a veces es necesario, pero cuando lo hagas, acompáñalo de un comentario explicando por qué. Si no, en seis meses ni tú vas a saber si era intencional.

---

### Dimensión 3 — Backend · Nivel 2

**Lo que está bien:** Blueprints separados, modelos con `serialize()` consistente, decoradores `@jwt_required()` donde toca.

**Áreas a pulir:**

1. **`extensions.py` y `utils.py` implementan lo mismo dos veces:**
   - `extensions.py:8-43` → clase `Mailer`.
   - `utils.py:11-39` → función `send_email`.

   Funcionalmente son idénticos. Te sugiero conservar uno (la clase `Mailer` se integra mejor con Flask) y borrar el otro.

2. **`print()` para logging:**
   ```python
   # src/api/extensions.py:38
   print("📨 Email enviado:", response.status_code)
   ```
   En desarrollo es cómodo, pero en producción se pierde o ensucia la salida. El módulo `logging` con niveles (`info`, `error`, `debug`) es el estándar.

3. **HTML embebido en código Python:**
   ```python
   # src/api/routes_recover.py:26
   html = f"""<h1 style='font-family: UnifrakturMaguntia, ...'>...</h1>..."""
   ```
   Es funcional, pero si algún día quieres cambiar el diseño del email, vas a tener que editar Python para tocar estilos. Mejor mover a un archivo de template (`flask.render_template`).

4. **Validación de inputs muy básica:**
   ```python
   # src/api/routes_auth.py:22
   if not email or not password or not shortname:
       return jsonify({"msg": "Faltan campos obligatorios"}), 400
   ```
   Verifica presencia, pero no formato del email, ni longitud mínima de contraseña, ni si el shortname cumple las reglas. Marshmallow o Pydantic resuelven esto con muy poco código y suben mucho la calidad percibida.

---

### Dimensión 4 — Estado y comunicación · Nivel 2

Ya cubierto en 2.5 (dos sistemas de auth). Detalles adicionales:

- **Dos keys de localStorage para "rutas guardadas":**
  - `flux.js:147` usa `"savedRoutes_local"`
  - `RoutesManager.jsx:4` usa `"shadowmap_saved_routes"`

  Si ambos archivos se usan en paralelo, cada uno ve un set distinto de rutas y los datos se desincronizan. Unifica a una sola key.

- **`API_URL` definido en dos sitios:** `authService.js:3` usa `VITE_API_URL` y `flux.js:4` importa de `../../api/config.js`. Centraliza en uno solo.

- **El frontend lee `user.is_premium`** (`profile.jsx:74`) pero el backend no envía ese campo. El badge "Cuenta Premium" no se va a renderizar correctamente hasta que arregles 2.3.

---

### Dimensión 5 — Seguridad · Nivel 1

Ver críticas 2.6 (JWT secret), 2.7 (CORS), 2.8 (ownership) y 2.9 (expiración de token). Lista accionable:

- [ ] Mover `JWT_SECRET_KEY` a `.env` (y añadirlo a `.env.example`).
- [ ] Restringir orígenes en CORS.
- [ ] Verificar ownership en endpoints PUT/DELETE.
- [ ] Añadir expiración a `recovery_token`.
- [ ] Validar longitud mínima de contraseña (8 caracteres es un buen mínimo).
- [ ] Considerar rate-limiting con Flask-Limiter en login/register/recover.

> Sobre JWT en `localStorage`: es el patrón que enseña 4Geeks y para un proyecto de bootcamp es aceptable. Si quieres explorar más, cookies `HttpOnly` son la forma profesional, pero está fuera del scope de la entrega.

---

### Dimensión 6 — Funcionalidad end-to-end · Nivel 2

Resumen honesto de qué funciona y qué no:

- ✅ Registro: funciona.
- ✅ Login: funciona.
- ❌ Activar Premium: falla en backend (ver 2.3).
- ❌ Gestión de Places (Add/Edit/Delete): las acciones no existen (ver 2.4).
- ❌ Crear y publicar ruta paranormal: el botón "Compartir" en `map.jsx:177` no tiene `onClick`; `RouteCreator.jsx:16` llama a una acción inexistente.
- ❌ Recuperación de contraseña por email: el flujo se rompe en el link (ver 2.10).
- ✅ Misiones (completar localmente): funciona, aunque solo persiste en `localStorage`.

**Lo bueno:** la mayoría son arreglos pequeños y muy localizados. No estás lejos de tener una app fullstack que se demuestra bien en una entrevista.

---

### Dimensión 7 — Git, docs · Nivel 2

- ⚠️ Algunos commits tienen mensajes poco descriptivos (`030526B`, `daa644a 030526B`). Una convención cómoda y profesional es Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`. Ejemplo: `feat: añadir endpoint de activación premium`.
- ⚠️ `.env.example` no incluye variables que tu código usa: `JWT_SECRET_KEY`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `FRONTEND_URL`. Quien clone tu repo no sabrá qué necesita configurar.
- ✅ El README es visualmente cuidado y tiene narrativa — gran punto a favor.
- ⚠️ El README no explica cómo levantar el backend más allá de `pipenv run start`. Faltaría: dónde va `.env`, cómo correr migraciones, cómo crear el primer usuario, qué versión de Python necesitas.

---

### Dimensión 8 — UX, accesibilidad · Nivel 2

- Reemplazar `alert()`/`confirm()` por toasts/modales propios casaría muchísimo mejor con tu estética.
- Mensajes de error genéricos como `"Error creando el lugar"` (`addPlace.jsx:37`) se pueden hacer más concretos (`"Latitud y longitud son obligatorias"`).
- Faltan estados de loading visibles en la mayoría de los formularios — incluso un spinner sencillo mejora la percepción.
- Inputs sin `htmlFor`/`id` asociados a sus labels — afecta accesibilidad.
- Click handlers en `<span>` para navegación — usa `<Link>` o `<button>`.

> Tu paleta, tipografía y animaciones están muy bien. Es una pena que el feedback al usuario use los componentes estándar del navegador.

---

### Dimensión 9 — Pruebas · Nivel 1

No hay tests todavía. ESLint está configurado, lo cual es buen punto de partida.

**Lo que te sumaría muchos puntos con poco esfuerzo:**
- 5-10 tests con `pytest` cubriendo: registro válido, registro con email duplicado, login válido, login con credenciales incorrectas, acceso a endpoint protegido sin token, creación de POI.
- Eliminar los `// eslint-disable-next-line` que no tengan justificación.

---

### Dimensión 10 — DevOps · Nivel 2

- ✅ `Procfile`, `render.yaml`, `Dockerfile.render` presentes.
- ✅ Scripts `npm run start`, `npm run build` correctos.
- ⚠️ `.env.example` incompleto (ver Dimensión 7).
- ⚠️ Conviven `requirements.txt` (167 bytes) y `Pipfile`. Mejor quédate con uno — `Pipfile` ya que ya lo usas.
- ⚠️ Existe `routes_health.py` pero no parece estar conectado al healthcheck del despliegue en `render.yaml`.

---

### Dimensión 11 — Originalidad y diseño · Nivel 3

Aquí es donde más brillas, y por eso lo dejo para el final. El concepto "ShadowMap = registro paranormal que te observa" tiene **identidad propia**. La copy del README, los avatares con lore, los nombres ("Identity Re-Stabilization", "Ruta tenebrosa"), la advertencia final del README… todo está cuidado.

Esto es lo que un reclutador recuerda. Cuando reciba 30 proyectos llamados "TaskApp" o "WeatherForecast", el tuyo va a ser **el de la app embrujada**. **Cuídalo y no lo subestimes.** Si la parte técnica llega al nivel del diseño, este proyecto es genuinamente memorable.

---

## 4. Plan de mejoras priorizado

He agrupado las mejoras por tiempo de inversión:

### 🔴 Urgentes (sin esto, partes del proyecto no funcionan)

1. Añadir `is_premium` al modelo `User` + migración (ver 2.3).
2. Borrar `src/api/routes.py` (el del `"fake-token"`) y `src/api/premium.py` (duplicado).
3. Decidir un solo `create_app()` y borrar el otro (ver 2.1).
4. Implementar las acciones faltantes en `flux.js` **o** retirar las vistas que las usan (ver 2.4).
5. Mover `JWT_SECRET_KEY` a `.env` (ver 2.6).
6. Arreglar el mismatch del link de email vs la ruta `/reset-password` (ver 2.10).
7. Elegir un solo sistema de autenticación y borrar el otro (ver 2.5).

### 🟠 Importantes (te suben de "aprobado" a "notable")

8. Añadir `user_id` a `POI`/`Place` y verificar ownership en PUT/DELETE.
9. Centralizar `API_URL`.
10. Unificar la key de localStorage para rutas.
11. Reemplazar `alert()`/`confirm()` por toasts o modales propios.
12. Restringir orígenes en CORS.
13. Añadir expiración a `recovery_token`.
14. Completar `.env.example` con todas las variables que tu código usa.
15. Actualizar el README con la sección de variables de entorno, migraciones, troubleshooting.

### 🟢 Excelencia (te llevan a sobresaliente)

16. Partir `map.jsx` en componentes más pequeños.
17. Mover el HTML del email a un template.
18. Añadir tests con pytest (mínimo 5–10 sobre los flujos críticos).
19. Configurar GitHub Actions con `pytest` + `eslint`.
20. Validación de inputs con Marshmallow o Pydantic.
21. Reemplazar `print` por `logging`.
22. Considerar React Query / SWR para fetches.

> **Recomendación práctica:** abre una rama por cada bloque (`fix/critical-issues`, `feat/ownership-and-security`, etc.). Vas a salir con un historial de Git que da gusto enseñar en entrevistas.

---

## 5. Calificación de referencia

> Esta calificación es una propuesta basada en el estado actual del código. Si al autoevaluarte llegas a una nota similar, es una excelente señal: significa que tu juicio técnico ya está calibrado.

| # | Dimensión | Peso | Nivel | Aporta |
|---|---|---|---|---|
| 1 | Estructura | 8 % | 2 | 4.00 |
| 2 | Frontend | 15 % | 2 | 7.50 |
| 3 | Backend | 15 % | 2 | 7.50 |
| 4 | Estado / API | 10 % | 2 | 5.00 |
| 5 | Seguridad | 15 % | 1 | 3.75 |
| 6 | Funcionalidad | 10 % | 2 | 5.00 |
| 7 | Git / Docs | 5 % | 2 | 2.50 |
| 8 | UX / Accesibilidad | 8 % | 2 | 4.00 |
| 9 | Pruebas | 5 % | 1 | 1.25 |
| 10 | DevOps | 5 % | 2 | 2.50 |
| 11 | Originalidad | 4 % | 3 | 3.00 |
| **Total** | | **100 %** | | **≈ 46 / 100** |

**Lectura honesta:** todavía no llegas al umbral de aprobado, pero la distancia es muy corta. **Con el bloque 🔴 (~1 día de trabajo enfocado) probablemente subes a 55–60.** Con el bloque 🟠 (3–4 días) a 70–80. El bloque 🟢 te lleva a sobresaliente.

Lo importante es que no necesitas reescribir el proyecto. Necesitas **terminarlo**.

---

## 6. Mensaje final

Tu proyecto tiene algo que muchos proyectos de bootcamp **no tienen**: alma. La narrativa, los detalles, el theming, la copy… eso vale mucho y no se enseña. Cuando un reclutador abra tu repo, va a recordar el tuyo.

Lo que esta revisión te está pidiendo no es "hazlo todo de nuevo". Te está pidiendo **terminar lo que empezaste**. El 80 % del trabajo de un dev junior real es exactamente esto: encontrar los `is_premium` que faltan, los `createPlace` por implementar, los `JWT_SECRET_KEY` en duro, y resolverlos antes de que los descubra un usuario o un compañero.

Si te concentras en el bloque 🔴 durante un día y luego revisas este documento de nuevo, vas a ver el progreso muy claro. Y cuando llegues al 🟢, tu portfolio va a tener un proyecto del que vale la pena hablar en entrevista.

**Confía en lo que ya hiciste bien. Termínalo. Estás más cerca de lo que parece.** 🌑
