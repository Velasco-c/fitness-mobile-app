# KidFit · Borrador (base: fitness-mobile-app)

Interfaz móvil (React + TypeScript + CSS) para KidFit, construida sobre el template fitness-mobile-app. Este borrador sirve para validar el dashboard, el acceso y los temas antes de migrarlos al proyecto real de KidFit (React Native).

## Qué incluye

- **Acceso** según el mockup «LOG IN»: logo KID / figura / FIT, LOG IN y CREAR CUENTA. Versión clara y oscura, como la imagen de referencia.
- **Dashboard** (pestaña Inicio):
  - Nombre del usuario en el título (sustituye «Mi panel»).
  - Notificaciones y avatar, como en el template.
  - Meta diaria de **niveles completados** (sustituye la meta de calorías).
  - Tarjetas Logros y Entrenos, y «Niveles realizados».
  - Pasos y distancia eliminados.
- **Niveles** (pestaña Niveles): primero se elige la categoría (tarjetas deslizables con su progreso). Al entrar, un mapa con sus niveles, cada uno con su dificultad (verde fácil, naranja normal, rojo difícil).
- **Hoy** (hidratación en vasos): la meta la elige el niño (4 a 12 vasos). Cada recordatorio equivale a un vaso y se reparte entre la hora de despertar y la de dormir. Para sumar agua hay que confirmar primero un recordatorio que ya sonó; no se puede pasar de la meta y «Deshacer» quita la última toma. Al cumplir la meta aparece la insignia. Ver «Hidratación» más abajo.
- **Perfil** (estilo perfil.png): foto, logros en anillos, calendario de la semana, avatares, apariencia claro/oscuro y cerrar sesión.
- **Bienvenida** tras iniciar sesión (cuenta u offline): animación del monito que cae, salta y expande la pantalla.
- Barra de navegación igual que en el template.

## Comandos

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # comprueba tipos y genera dist/
npm run preview    # revisa el build
```

## Estructura

```
src/
  styles/
    tokens/         Sistema de diseño de KidFit: palette.css, theme.css, layout.css
    base.css        Reset, marco de teléfono, barra inferior, capas
    components.css  Tarjetas, anillos, métricas, botones, formularios, avisos
    screens.css     Fondos y layouts por pantalla
    levels.css      Mapa de niveles
    login.css       Pantalla de acceso
  components/       Piezas reutilizables (Logo, LevelMap, Ring, TabBar...)
  context/          Estado global: usuario y notificaciones; tema claro/oscuro
  screens/          Login, Summary (dashboard), SelectActivity (niveles), Opal, Profile
  data/             Datos de ejemplo (editar aquí)
  config/           Pestañas de la barra inferior
  types/ utils/     Tipos y validación del registro
```

## Temas y colores

Todos los colores salen de `src/styles/tokens/`. Los componentes usan solo tokens `--kf-*`; no hay colores fijos en el código, salvo el bisel del marco de teléfono.

- `palette.css`: 9 colores de marca y 7 neutros, tomados del mockup.
- `theme.css`: tokens semánticos para tema claro y oscuro. Se activan con `data-theme` en `<html>`, o siguen al sistema si no hay atributo.
- `layout.css`: radios, tamaños, espaciado, sombras y movimiento.

Son la base del sistema de diseño de KidFit. Esta versión añade a `theme.css` y `layout.css` los tokens del acceso y del vidrio (`--kf-hero-*`, `--kf-logo-*`, `--kf-glass*`, `--kf-tint`, `--kf-track`), además de la fuente, la sombra pequeña y el movimiento. Al migrar, copia estos archivos a `src/ui/theme/` y añade esos tokens también a `tokens.ts`.

## Datos a editar

| Archivo | Qué controla |
|---|---|
| `public/data/levels.json` | Categorías, niveles, dificultad, estrellas y cámara |
| `public/data/water.json` | Meta inicial, límites, horario de recordatorios y tamaños de toma (en vasos) |
| `public/data/summary.json` | Meta diaria de niveles (`goal`) |
| `public/data/profile.json` | Avatar y color de partida (`defaultAvatar`, `defaultTone`), lista de ilustraciones (`id`, `tone`, `src`) y días de actividad de partida (`seedActiveDays`) |
| `public/data/achievements.json` | Logros: título, descripción, color del anillo y regla que los desbloquea |
| `public/data/users.json` | Usuarios de ejemplo del acceso |
| `public/data/notifications.json` | Notificaciones iniciales |
| `src/config/features.ts` | Funciones opcionales (perfil, meta en el registro) |
| `src/data/goals.ts` | Opciones de «Meta» del registro |

## Niveles y categorías

Todo sale de `public/data/levels.json`. Se edita sin recompilar: guarda el archivo y recarga la página.

- **Categoría**: `id` único, `name`, `subtitle` (p. ej. «Mundo 1»), `tone` (`blue`, `green`, `orange`, `teal`, `pink`, `indigo` o `slate`) y su lista `levels`.
- **Nivel**: una línea con `title` (`null` muestra «Por definir»), `pattern` (clave del movimiento, o `null`), `difficulty` (1 fácil, 2 normal, 3 difícil) y `stars` (0 a 3).

Para añadir un nivel, copia una línea dentro de `levels` de la categoría. El número y el orden se calculan solos. Un nivel con estrellas está completado; el primero sin estrellas es el actual, y los siguientes quedan bloqueados. Para añadir una categoría, copia un bloque completo dentro de `categories`. `movementSource` es el texto del nivel («Cámara frontal»).

Si el JSON tiene un error (categoría repetida, sin niveles o dificultad fuera de 1–3), la pestaña muestra el motivo en vez de fallar.

## Progreso guardado

Hidratación, niveles jugados, racha y recordatorios se guardan en el navegador (`localStorage`, clave `kidfit.progress.v1`). La primera vez se siembran desde los JSON: meta de `water.json`, niveles con estrellas de `levels.json` y días de actividad de `profile.json`. Después, el progreso manda sobre los JSON.

- **Racha**: días seguidos con actividad. Cuenta como actividad terminar un nivel o cumplir la meta de agua. Si hoy todavía no tiene actividad, la racha sigue desde ayer.
- **Estrellas de un nivel**: la mejor marca entre `levels.json` y lo jugado.
- **Modo prueba**: «Terminar nivel» pide las estrellas a mano hasta conectar la cámara. Para reiniciar todo, borra `kidfit.progress.v1` en las herramientas del navegador.

## Logros y avatar

- **Logros**: se editan en `achievements.json`. Cada logro tiene una regla:
  - `levelsDone` (niveles terminados), `stars` (estrellas totales), `streak` (racha de días), `waterGoalDays` (días con la meta de agua cumplida) y `categoriesDone` (categorías completas).
  - El progreso se calcula solo. Al cumplirse, el logro se guarda con su fecha y aparece un aviso. Una vez desbloqueado, se queda aunque la racha se corte.
  - Para añadir un logro: copia un bloque, cambia `id`, textos, `tone` y `rule`.
- **Avatar**: al tocar una ilustración en el perfil, el círculo y el encabezado toman su color. Las ilustraciones son `public/img/avatars/a1.png` a `a6.png` (recortadas en círculo) y su color sale de `profile.json`.
- **Lápiz**: abre «Editar perfil». Ahí se puede subir una foto propia (se recorta en cuadrado), quitarla para dejar solo el color, o cambiar el color de fondo con los círculos de colores.
- **Nombre y correo**: no se editan aquí.
- **Notificaciones**: se borran deslizando la fila a un lado, como en Gmail. Si no se desliza lo suficiente, vuelve a su sitio.
- **Nombre y correo**: vienen de la cuenta (`users.json`) y no cambian al elegir avatar.

## Hidratación

- **Meta**: se cambia tocando «Cambiar» junto a la meta. El texto de la hoja explica cada cuánto sonará el recordatorio y el equivalente aproximado en litros.
- **Recordatorios**: `(hora de dormir − hora de despertar) / meta`, redondeado a 5 min hacia abajo. Con 8 vasos entre 07:00 y 20:00, cada 1 h 35 min.
- **Estados**: «Llega a las…» (espera), «¡Ya toca!» (suena), «Confirmado» (ya puedes sumar el vaso) y «Meta lista».
- **Tamaños**: `amounts` en `water.json` (por defecto 1 y 2 vasos). Si añades tamaños que no sumen para llegar a la meta, el niño podría no alcanzarla.
- **Probar recordatorio**: botón dentro de la hoja de meta. Hace que suene el siguiente recordatorio. Se apaga con `demoReminder` en `features.ts`.

## Funciones opcionales

`src/config/features.ts` activa o desactiva funciones:

- `profile`: pestaña Perfil (encendida).
- `registerGoal`: campo «Meta» en el registro (apagado).
- `demoReminder`: botón «Probar recordatorio» (encendido, para pruebas).

Si apagas `profile`, la pestaña Perfil desaparece de la barra y «Cerrar sesión» queda al final de Inicio.

## Pendiente antes de migrar a KidFit

1. **Niveles.** Cada categoría trae 15 niveles de ejemplo. Solo «Sentadilla del Gigante» tiene nombre y patrón; los demás aparecen como «Por definir».
3. **Metas del registro.** Movimiento, Descanso y Enfoque son del template. Falta definir las metas de KidFit.
4. **Tarjeta Entrenos.** Se conservó del template con su texto vacío. Confirmar si se queda.
5. **Tipografía.** El mockup convierte el texto en trazos, así que la familia es de sistema. Falta la fuente real.
6. **Contraste.** El texto de error y «Cerrar sesión» usan el rojo de marca, que tiene poco contraste sobre fondo claro y oscuro (ver el README de tokens de KidFit).
7. **Persistencia.** El progreso (agua, niveles, racha, logros y avatar) sí se guarda en el navegador. Es por dispositivo, no por cuenta: si entran dos cuentas en el mismo navegador comparten progreso. La sesión no: al recargar vuelve el acceso. Cuando haya backend, hay que mover el progreso a él (la lógica está en `utils/progress.ts` y el estado en `context/ProgressContext.tsx`).

## Publicar en GitHub Pages

1. Crea un repositorio y sube estos archivos a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml` y publica la web.
