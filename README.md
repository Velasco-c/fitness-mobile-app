# fitness-mobile-app

Interfaz móvil (React + TypeScript + CSS) inspirada en Apple Fitness, Opal, Oura y Revolut.
Se muestra dentro de un marco de teléfono en PC y a pantalla completa en móvil.

## Pantallas
- **Summary**: anillo de actividad, pasos, distancia, sesiones y premios.
- **Opal**: puntuación con arco, categorías Sleep / Focus / Rest y métricas.
- **Activity**: selección de actividad y fuentes de frecuencia cardíaca.
- **Profile**: registro de usuario (con validación) y sesión.
- **Notificaciones**: campana con contador, panel y avisos emergentes.

## Comandos
```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # comprueba tipos y genera dist/
npm run preview    # revisa el build
```

## Estructura (cada capa tiene una sola responsabilidad)
```
src/
  types/          Tipos compartidos (TabId, Metric, UserProfile...)
  config/         Navegación (pestañas)
  data/           Datos de ejemplo: editar aquí los valores que se muestran
  context/        Estado global: usuario y notificaciones
  utils/          Validaciones (registro)
  components/     Piezas reutilizables: anillos, tarjetas, barra inferior, iconos, marco
  screens/        Pantallas completas, una por archivo
  styles/         tokens.css (colores y tipografía), base.css, components.css, screens.css
```

### Cambiar colores
Todo sale de `src/styles/tokens.css`. El verde principal es `--green`.

## Publicar en GitHub Pages
1. Crea un repositorio llamado `fitness-mobile-app` y sube estos archivos a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml` y publica la web.
