#  App de Tareas - Progressive Web App (PWA)

##  Descripción

**App de Tareas** es una Progressive Web App (PWA) completa para la gestión de tareas, desarrollada con HTML5, CSS3 y JavaScript puro. La aplicación implementa el patrón **App Shell** para garantizar una experiencia rápida y fluida, con soporte completo para **modo offline** mediante Service Workers.

---

##  Características Principales

-  **App Shell Architecture**: Carga instantánea de la interfaz
-  **Modo Offline**: Funciona completamente sin conexión a internet
-  **Instalable**: Se puede instalar como aplicación nativa en dispositivos
-  **Diseño Responsivo**: Adaptado a móviles, tablets y escritorio
-  **Rendimiento Optimizado**: Caché inteligente con Service Workers
-  **Gestión de Tareas**: Vista de tareas pendientes, completadas y estadísticas
-  **Indicador de Conexión**: Muestra el estado online/offline en tiempo real

---

##  Arquitectura del Proyecto

### Estructura de Archivos

```
pwa-app-shell/
│
├── index.html              # Estructura principal del App Shell
├── styles.css              # Estilos responsivos con CSS Grid y Flexbox
├── app.js                  # Lógica de la aplicación y carga dinámica
├── sw.js                   # Service Worker para caché y offline
├── manifest.json           # Manifiesto de la aplicación PWA
├── data.json               # Datos de ejemplo (lista de tareas)
├── README.md               # Este archivo
│
└── icons/                  # Íconos de la aplicación
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

### Patrón App Shell

El **App Shell** es la estructura mínima de la interfaz de usuario que se carga primero y se mantiene en caché:

- **Encabezado**: Logo y título de la aplicación
- **Menú de Navegación**: Barra lateral con enlaces (Inicio, Tareas, Completadas, Acerca de)
- **Área de Contenido**: Región dinámica donde se cargan las diferentes vistas
- **Pie de Página**: Información de versión y copyright

El contenido dinámico (lista de tareas) se carga posteriormente desde `data.json`.

### Service Worker

El Service Worker (`sw.js`) implementa dos estrategias de caché:

1. **Cache First** (App Shell):
   - Archivos estáticos: HTML, CSS, JS, íconos
   - Se sirven desde caché para carga instantánea
   - Se actualizan en segundo plano

2. **Network First** (Datos dinámicos):
   - Archivo `data.json`
   - Intenta obtener datos frescos de la red
   - Si falla, usa datos cacheados
   - Incluye datos de respaldo para offline completo

---

##  Configuración e Instalación

### Requisitos Previos

- Visual Studio Code
- Navegador web moderno (Chrome, Edge, Firefox, Safari)

### Servidor Local con Live Server

1. **Clonar o descargar el proyecto**:
   ```bash
   git clone https://github.com/Azus34/pwa-app-shell.git
   cd pwa-app-shell
   ```

2. **Abrir en Visual Studio Code**:
   ```bash
   code .
   ```

3. **Instalar extensión Live Server** (si no la tienes):
   - Ve a la pestaña de Extensiones (Ctrl+Shift+X)
   - Busca "Live Server"
   - Instala la extensión de Ritwick Dey

4. **Iniciar el servidor local**:
   - Clic derecho en `index.html`
   - Selecciona "Open with Live Server"
   - O usa el botón "Go Live" en la barra de estado

5. **Acceder a la aplicación**:
   - Se abrirá automáticamente en `http://localhost:5500` o similar
   - La aplicación estará lista para usar


### Instalación como PWA

Una vez que la aplicación esté corriendo:

1. En **Chrome/Edge**:
   - Busca el ícono de instalación (➕) en la barra de direcciones
   - O ve a Menú → "Instalar App de Tareas"
   - Acepta la instalación

2. En **dispositivos móviles**:
   - Abre el menú del navegador
   - Selecciona "Agregar a pantalla de inicio"
   - La aplicación se instalará como app nativa

---

##  Cómo Probar el Modo Offline

### Método 1: DevTools de Chrome

1. Abre la aplicación en Chrome
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **"Network"** (Red)
4. Marca la casilla **"Offline"** en la parte superior
5. Recarga la página (`Ctrl+R` o `F5`)
6. La aplicación debería funcionar perfectamente sin conexión

### Método 2: Application Tab

1. Abre DevTools (`F12`)
2. Ve a la pestaña **"Application"**
3. En el menú lateral, selecciona **"Service Workers"**
4. Marca la casilla **"Offline"**
5. Verifica que el Service Worker esté activo
6. Navega por la aplicación

### Método 3: Modo Avión

1. Activa el modo avión en tu dispositivo
2. Abre la aplicación instalada
3. Verifica que todo funcione correctamente

### Verificación de Caché

En DevTools → Application → Cache Storage:
- `app-shell-v1`: Contiene archivos estáticos
- `data-cache-v1`: Contiene datos dinámicos

---

##  Diseño Responsivo

La aplicación se adapta a diferentes tamaños de pantalla:

### Escritorio (> 768px)
- Menú lateral fijo visible
- Contenido con margen lateral
- Layout de 2 columnas

### Tablet y Móvil (≤ 768px)
- Menú hamburguesa con overlay
- Menú lateral deslizable
- Layout de 1 columna
- Tarjetas de estadísticas apiladas

---

##  Contenido Dinámico

### Estructura de Datos (data.json)

```json
{
  "id": 1,
  "task": "Nombre de la tarea",
  "completed": false,
  "priority": "high|medium|low",
  "category": "trabajo|personal|salud",
  "dueDate": "2025-10-20"
}
```

### Vistas Disponibles

1. **Inicio (Home)**: Panel con estadísticas y tareas recientes
2. **Tareas**: Lista de tareas pendientes
3. **Completadas**: Tareas marcadas como completadas
4. **Acerca de**: Información de la aplicación

---

##  Tecnologías Utilizadas

- **HTML5**: Estructura semántica con elementos modernos
- **CSS3**: 
  - Variables CSS (custom properties)
  - Flexbox y CSS Grid
  - Media Queries para responsive
  - Animaciones y transiciones
- **JavaScript ES6+**:
  - Async/Await
  - Fetch API
  - DOM Manipulation
  - Event Listeners
- **Service Worker API**: Caché y estrategias offline
- **Web App Manifest**: Configuración de PWA
- **Cache Storage API**: Almacenamiento de recursos

---

##  Comentarios en el Código

Todos los archivos incluyen comentarios detallados:

- `index.html`: Secciones del App Shell
- `styles.css`: Organización por componentes
- `app.js`: Funciones y flujos principales
- `sw.js`: Estrategias de caché y eventos


---

##  Solución de Problemas

### El Service Worker no se registra
- Asegúrate de usar HTTPS o localhost
- Verifica la consola de DevTools por errores
- Limpia el caché y recarga

### La aplicación no funciona offline
- Verifica que el Service Worker esté activo (DevTools → Application)
- Comprueba que los archivos estén en caché
- Espera a que se complete la primera carga

### No puedo instalar la PWA
- Verifica que el manifest.json sea válido
- Asegúrate de usar HTTPS (o localhost)
- Comprueba que los íconos existan

---
