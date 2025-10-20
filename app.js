// ========================================
// Constantes y configuración
// ========================================
const API_URL = 'data.json';
let tasksData = [];

// ========================================
// Registro del Service Worker
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('✓ Service Worker registrado correctamente:', registration.scope);
            })
            .catch(error => {
                console.error('✗ Error al registrar el Service Worker:', error);
            });
    });
}

// ========================================
// Inicialización de la aplicación
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkOnlineStatus();
    loadDefaultView();
});

// ========================================
// Función de inicialización
// ========================================
function initializeApp() {
    console.log('📱 Iniciando App de Tareas PWA...');
    
    // Registrar eventos de conexión
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
}

// ========================================
// Configuración de event listeners
// ========================================
function setupEventListeners() {
    // Menú toggle para móvil
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    menuToggle?.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeMenu?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);
    
    // Navegación entre vistas
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            
            // Actualizar clase active
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Cargar vista
            loadView(view);
            
            // Cerrar menú en móvil
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

// ========================================
// Función para cerrar sidebar
// ========================================
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
}

// ========================================
// Verificar estado de conexión
// ========================================
function checkOnlineStatus() {
    handleOnlineStatus();
}

function handleOnlineStatus() {
    const statusElement = document.getElementById('connectionStatus');
    const statusText = statusElement?.querySelector('.status-text');
    
    if (navigator.onLine) {
        statusElement?.classList.remove('offline');
        if (statusText) statusText.textContent = 'En línea';
        console.log('🌐 Aplicación en línea');
    } else {
        statusElement?.classList.add('offline');
        if (statusText) statusText.textContent = 'Sin conexión';
        console.log('📴 Aplicación sin conexión - Modo offline');
    }
}

// ========================================
// Cargar vista por defecto
// ========================================
function loadDefaultView() {
    loadView('home');
}

// ========================================
// Cargar vista dinámica
// ========================================
async function loadView(viewName) {
    const contentDiv = document.getElementById('dynamicContent');
    
    // Mostrar indicador de carga
    contentDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando...</p>
        </div>
    `;
    
    // Simular pequeño delay para UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    switch(viewName) {
        case 'home':
            await renderHomeView(contentDiv);
            break;
        case 'tasks':
            await renderTasksView(contentDiv);
            break;
        case 'completed':
            await renderCompletedView(contentDiv);
            break;
        case 'about':
            renderAboutView(contentDiv);
            break;
        default:
            renderHomeView(contentDiv);
    }
    
    // Agregar animación de entrada
    contentDiv.classList.add('fade-in');
}

// ========================================
// Vista de inicio (Home)
// ========================================
async function renderHomeView(container) {
    // Cargar datos de tareas
    await loadTasksData();
    
    const totalTasks = tasksData.length;
    const completedTasks = tasksData.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasksData.filter(t => t.priority === 'high' && !t.completed).length;
    
    container.innerHTML = `
        <h2 class="view-title">📊 Panel de Control</h2>
        
        <div class="task-stats">
            <div class="stat-card">
                <span class="stat-number">${totalTasks}</span>
                <span class="stat-label">Total de Tareas</span>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #FF9800, #F57C00);">
                <span class="stat-number">${pendingTasks}</span>
                <span class="stat-label">Tareas Pendientes</span>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #2196F3, #1976D2);">
                <span class="stat-number">${completedTasks}</span>
                <span class="stat-label">Tareas Completadas</span>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #F44336, #D32F2F);">
                <span class="stat-number">${highPriorityTasks}</span>
                <span class="stat-label">Prioridad Alta</span>
            </div>
        </div>
        
        <h3 style="margin-top: 30px; margin-bottom: 15px; color: var(--text-dark);">🔥 Tareas Recientes</h3>
        <ul class="task-list">
            ${renderTaskItems(tasksData.slice(0, 5))}
        </ul>
    `;
}

// ========================================
// Vista de todas las tareas
// ========================================
async function renderTasksView(container) {
    await loadTasksData();
    
    const pendingTasks = tasksData.filter(t => !t.completed);
    
    container.innerHTML = `
        <h2 class="view-title">📋 Todas las Tareas Pendientes</h2>
        ${pendingTasks.length > 0 ? `
            <ul class="task-list">
                ${renderTaskItems(pendingTasks)}
            </ul>
        ` : `
            <div class="empty-state">
                <div class="empty-state-icon">🎉</div>
                <h3>¡No hay tareas pendientes!</h3>
                <p>Has completado todas tus tareas. ¡Buen trabajo!</p>
            </div>
        `}
    `;
}

// ========================================
// Vista de tareas completadas
// ========================================
async function renderCompletedView(container) {
    await loadTasksData();
    
    const completedTasks = tasksData.filter(t => t.completed);
    
    container.innerHTML = `
        <h2 class="view-title">✅ Tareas Completadas</h2>
        ${completedTasks.length > 0 ? `
            <ul class="task-list">
                ${renderTaskItems(completedTasks)}
            </ul>
        ` : `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No hay tareas completadas</h3>
                <p>Las tareas que completes aparecerán aquí.</p>
            </div>
        `}
    `;
}

// ========================================
// Vista Acerca de
// ========================================
function renderAboutView(container) {
    container.innerHTML = `
        <h2 class="view-title">ℹ️ Acerca de la Aplicación</h2>
        <div style="line-height: 1.8;">
            <h3 style="color: var(--primary-color); margin-top: 20px;">App de Tareas - PWA</h3>
            <p style="margin-bottom: 15px;">
                Esta es una Progressive Web App (PWA) de gestión de tareas, desarrollada con 
                tecnologías web modernas incluyendo HTML5, CSS3 y JavaScript.
            </p>
            
            <h4 style="color: var(--primary-color); margin-top: 25px;">🚀 Características</h4>
            <ul style="margin-left: 20px; margin-bottom: 15px;">
                <li>✓ Funciona sin conexión (modo offline)</li>
                <li>✓ Instalable como aplicación nativa</li>
                <li>✓ Diseño responsivo para todos los dispositivos</li>
                <li>✓ App Shell para carga rápida</li>
                <li>✓ Caché inteligente con Service Worker</li>
                <li>✓ Interfaz moderna y limpia</li>
            </ul>
            
            <h4 style="color: var(--primary-color); margin-top: 25px;">🛠️ Tecnologías Utilizadas</h4>
            <ul style="margin-left: 20px; margin-bottom: 15px;">
                <li>HTML5 - Estructura semántica</li>
                <li>CSS3 - Flexbox, Grid, Variables CSS</li>
                <li>JavaScript ES6+ - Async/Await, Fetch API</li>
                <li>Service Worker - Caché y offline</li>
                <li>Web App Manifest - Instalación PWA</li>
            </ul>
            
            <h4 style="color: var(--primary-color); margin-top: 25px;">📱 Instalación</h4>
            <p style="margin-bottom: 15px;">
                Puedes instalar esta aplicación en tu dispositivo desde el navegador. 
                Busca el botón de "Instalar" en la barra de direcciones o en el menú del navegador.
            </p>
            
            <div style="background: var(--primary-light); padding: 20px; border-radius: 8px; margin-top: 20px;">
                <strong>Versión:</strong> 1.0.0<br>
                <strong>Última actualización:</strong> Octubre 2025<br>
                <strong>Desarrollado por:</strong> Tu Nombre
            </div>
        </div>
    `;
}

// ========================================
// Renderizar items de tareas
// ========================================
function renderTaskItems(tasks) {
    if (!tasks || tasks.length === 0) {
        return '<li style="text-align: center; padding: 20px; color: var(--text-light);">No hay tareas para mostrar</li>';
    }
    
    return tasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-text">
                ${task.completed ? '✓' : '○'} ${task.task}
                <span class="task-priority ${task.priority}">${task.priority}</span>
            </div>
        </li>
    `).join('');
}

// ========================================
// Cargar datos de tareas desde JSON
// ========================================
async function loadTasksData() {
    try {
        // Intentar cargar datos desde el servidor/caché
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('No se pudieron cargar los datos');
        }
        
        tasksData = await response.json();
        console.log(`✓ Datos cargados: ${tasksData.length} tareas`);
        
    } catch (error) {
        console.warn('⚠️ Error al cargar datos, usando datos de respaldo:', error);
        
        // Datos de respaldo si falla la carga (para modo offline)
        tasksData = [
            { id: 1, task: 'Comprar víveres para la semana', completed: false, priority: 'high' },
            { id: 2, task: 'Terminar informe del proyecto', completed: false, priority: 'high' },
            { id: 3, task: 'Llamar al dentista para cita', completed: true, priority: 'medium' },
            { id: 4, task: 'Revisar correos pendientes', completed: false, priority: 'medium' },
            { id: 5, task: 'Hacer ejercicio 30 minutos', completed: true, priority: 'low' }
        ];
    }
}

// ========================================
// Logs de diagnóstico
// ========================================
console.log('📱 App de Tareas PWA - Versión 1.0.0');
console.log('🔧 Service Worker:', 'serviceWorker' in navigator ? 'Soportado' : 'No soportado');
console.log('📦 Cache API:', 'caches' in window ? 'Soportado' : 'No soportado');
