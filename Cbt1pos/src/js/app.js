// Main Application Class
class PosApp {
    constructor() {
        this.currentModule = null;
        this.modules = {
            pos: { load: loadPosModule, icon: 'fa-cash-register', name: 'POS' },
            inventory: { load: loadInventoryModule, icon: 'fa-boxes', name: 'Inventario' },
            contracts: { load: loadContractsModule, icon: 'fa-file-contract', name: 'Contratos' },
            people: { load: loadPeopleModule, icon: 'fa-users', name: 'Personas' },
            waste: { load: loadWasteModule, icon: 'fa-trash-alt', name: 'Merma' },
            reports: { load: loadReportsModule, icon: 'fa-chart-bar', name: 'Reportes' },
            settings: { load: loadSettingsModule, icon: 'fa-cog', name: 'Configuración' }
        };
    }

    // Initialize application
    async init() {
        // Check license
        if (!await this.checkLicense()) {
            return;
        }

        // Check authentication
        if (!await this.checkAuth()) {
            return;
        }

        // Load navigation
        await this.loadNavigation();

        // Load default module (POS)
        await this.loadModule('pos');

        // Add event listeners
        this.addEventListeners();
    }

    // Check license
    async checkLicense() {
        const license = new License();
        const isValid = await license.validate();
        if (!isValid) {
            document.body.innerHTML = `
                <div class="flex items-center justify-center min-h-screen bg-gray-100">
                    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <div class="text-center">
                            <i class="fas fa-lock text-red-500 text-5xl mb-4"></i>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">Licencia Inválida</h2>
                            <p class="text-gray-600 mb-4">
                                Por favor, contacte con el administrador para activar su licencia.
                            </p>
                            <button onclick="location.reload()"
                                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return false;
        }
        return true;
    }

    // Check authentication
    async checkAuth() {
        const auth = new Auth();
        const isAuthenticated = await auth.checkAuth();
        if (!isAuthenticated) {
            document.body.innerHTML = `
                <div class="flex items-center justify-center min-h-screen bg-gray-100">
                    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <div class="text-center mb-8">
                            <i class="fas fa-user-lock text-blue-500 text-5xl mb-4"></i>
                            <h2 class="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                        </div>
                        <form id="loginForm" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Usuario</label>
                                <input type="text" id="username" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input type="password" id="password" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <button type="submit"
                                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    Ingresar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const success = await auth.login(username, password);
                if (success) {
                    location.reload();
                } else {
                    alert('Usuario o contraseña incorrectos');
                }
            });

            return false;
        }
        return true;
    }

    // Load navigation
    async loadNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto';
        nav.innerHTML = `
            <div class="p-4">
                <div class="flex items-center justify-between mb-8">
                    <h1 class="text-xl font-bold">CBT1 POS</h1>
                    <button id="toggleNav" class="lg:hidden">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                <div class="space-y-2">
                    ${Object.entries(this.modules).map(([key, module]) => `
                        <button data-module="${key}" class="nav-item w-full flex items-center p-2 rounded hover:bg-gray-700">
                            <i class="fas ${module.icon} w-6"></i>
                            <span class="ml-2">${module.name}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium" id="userName">Usuario</p>
                            <p class="text-xs text-gray-400" id="userRole">Rol</p>
                        </div>
                    </div>
                    <button onclick="app.logout()" 
                            class="w-full flex items-center p-2 rounded hover:bg-gray-700">
                        <i class="fas fa-sign-out-alt w-6"></i>
                        <span class="ml-2">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        `;

        // Add navigation to body
        document.body.insertBefore(nav, document.body.firstChild);

        // Create main content area
        const main = document.createElement('main');
        main.className = 'ml-64 p-8';
        main.innerHTML = '<div id="moduleContent"></div>';
        document.body.appendChild(main);

        // Update user info
        this.updateUserInfo();
    }

    // Add event listeners
    addEventListeners() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const module = item.dataset.module;
                this.loadModule(module);
            });
        });

        // Toggle navigation on mobile
        document.getElementById('toggleNav').addEventListener('click', () => {
            const nav = document.querySelector('nav');
            nav.classList.toggle('-translate-x-full');
        });
    }

    // Load module
    async loadModule(moduleName) {
        if (this.currentModule === moduleName) return;

        // Update navigation state
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.module === moduleName) {
                item.classList.add('bg-gray-700');
            } else {
                item.classList.remove('bg-gray-700');
            }
        });

        // Load module
        this.currentModule = moduleName;
        await this.modules[moduleName].load();
    }

    // Update user info
    updateUserInfo() {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        document.getElementById('userName').textContent = user.fullName || 'Usuario';
        document.getElementById('userRole').textContent = this.getRoleName(user.role) || 'Rol';
    }

    // Logout
    logout() {
        if (confirm('¿Está seguro de cerrar sesión?')) {
            localStorage.removeItem('currentUser');
            location.reload();
        }
    }

    // Helper methods
    getRoleName(role) {
        const roles = {
            admin: 'Administrador',
            manager: 'Gerente',
            supervisor: 'Encargado',
            cashier: 'Cajero'
        };
        return roles[role] || role;
    }
}

// Initialize application
const app = new PosApp();
document.addEventListener('DOMContentLoaded', () => app.init());
