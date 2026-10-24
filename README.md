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
- **Niveles** (pestaña Niveles): mapa de niveles con el mismo componente del template, con el nivel 5 de KidFit («Sentadilla del Gigante», de `nivel05_sentadilla.json`).
- **Hoy**: vaso animado con las tomas del día, barra de lo que falta para la meta, botón grande con gota para confirmar recordatorios (con animación), tomas del día y medidor de porcentaje consumido al final. Los datos vienen de `public/data/water.json`.
- **Perfil** (estilo perfil.png): foto, logros en anillos, calendario de la semana, botón de tienda, avatares y selector de apariencia.
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
| `data/levels.ts` | Niveles, dificultad, estrellas, progreso del mundo |
| `data/summary.ts` | Meta diaria de niveles (`levelsToday` / `goal`) |
| `data/user.ts` | Usuario de ejemplo del botón LOG IN |
| `data/notifications.ts` | Notificaciones iniciales |
| `data/goals.ts` | Opciones de «Meta» del registro |

## Pendiente antes de migrar a KidFit

1. **Niveles.** Solo el nivel 5 tiene nombre y patrón. Los demás aparecen como «Por definir».
3. **Metas del registro.** Movimiento, Descanso y Enfoque son del template. Falta definir las metas de KidFit.
4. **Tarjeta Entrenos.** Se conservó del template con su texto vacío. Confirmar si se queda.
5. **Tipografía.** El mockup convierte el texto en trazos, así que la familia es de sistema. Falta la fuente real.
6. **Contraste.** El texto de error y «Cerrar sesión» usan el rojo de marca, que tiene poco contraste sobre fondo claro y oscuro (ver el README de tokens de KidFit).
7. **Persistencia.** La sesión no se guarda: al recargar vuelve el acceso. Solo el tema se recuerda en el navegador.

## Publicar en GitHub Pages

1. Crea un repositorio y sube estos archivos a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml` y publica la web.
