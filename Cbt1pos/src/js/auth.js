// Authentication and User Management System
class AuthManager {
    constructor() {
        this.USERS_KEY = 'cbt1pos_users';
        this.CURRENT_USER_KEY = 'cbt1pos_current_user';
        this.initializeDefaultAdmin();
    }

    // User roles and their permissions
    static ROLES = {
        ADMIN: 'administrador',
        MANAGER: 'gerente',
        SUPERVISOR: 'encargado',
        CASHIER: 'cajero'
    };

    static PERMISSIONS = {
        [this.ROLES.ADMIN]: ['all'],
        [this.ROLES.MANAGER]: ['pos', 'inventory', 'reports', 'contracts', 'people', 'waste'],
        [this.ROLES.SUPERVISOR]: ['pos', 'reports', 'contracts', 'waste'],
        [this.ROLES.CASHIER]: ['pos']
    };

    // Initialize default admin if no users exist
    initializeDefaultAdmin() {
        const users = this.getUsers();
        if (users.length === 0) {
            const defaultAdmin = {
                id: this.generateUserId(),
                username: 'admin',
                password: this.hashPassword('admin123'), // In production, use a secure password
                role: AuthManager.ROLES.ADMIN,
                name: 'Administrador',
                email: 'admin@cbt1pos.com',
                active: true,
                created: new Date().toISOString()
            };
            this.saveUsers([defaultAdmin]);
        }
    }

    // User authentication
    async login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => 
            u.username === username && 
            u.password === this.hashPassword(password) &&
            u.active
        );

        if (!user) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // Store current user without sensitive data
        const userSession = this.sanitizeUser(user);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userSession));

        return userSession;
    }

    // Logout current user
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    // Get current logged in user
    getCurrentUser() {
        const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    // Create new user (admin/manager only)
    createUser(currentUser, newUserData) {
        if (!this.hasPermission(currentUser, 'createUser')) {
            throw new Error('No tiene permisos para crear usuarios');
        }

        const users = this.getUsers();
        
        // Validate username uniqueness
        if (users.some(u => u.username === newUserData.username)) {
            throw new Error('El nombre de usuario ya existe');
        }

        const newUser = {
            ...newUserData,
            id: this.generateUserId(),
            password: this.hashPassword(newUserData.password),
            active: true,
            created: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        return this.sanitizeUser(newUser);
    }

    // Update user
    updateUser(currentUser, userId, updates) {
        if (!this.hasPermission(currentUser, 'updateUser')) {
            throw new Error('No tiene permisos para actualizar usuarios');
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        // Don't allow role escalation
        if (updates.role && !this.canManageRole(currentUser, updates.role)) {
            throw new Error('No tiene permisos para asignar este rol');
        }

        // Update user
        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            modified: new Date().toISOString()
        };

        this.saveUsers(users);
        return this.sanitizeUser(users[userIndex]);
    }

    // Deactivate user
    deactivateUser(currentUser, userId) {
        return this.updateUser(currentUser, userId, { active: false });
    }

    // Change password
    changePassword(userId, oldPassword, newPassword) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        if (users[userIndex].password !== this.hashPassword(oldPassword)) {
            throw new Error('Contraseña actual incorrecta');
        }

        users[userIndex].password = this.hashPassword(newPassword);
        users[userIndex].modified = new Date().toISOString();

        this.saveUsers(users);
    }

    // Check if user has permission
    hasPermission(user, permission) {
        if (!user || !user.role) return false;

        const permissions = AuthManager.PERMISSIONS[user.role];
        return permissions.includes('all') || permissions.includes(permission);
    }

    // Check if user can manage a specific role
    canManageRole(user, targetRole) {
        const roleHierarchy = {
            [AuthManager.ROLES.ADMIN]: 4,
            [AuthManager.ROLES.MANAGER]: 3,
            [AuthManager.ROLES.SUPERVISOR]: 2,
            [AuthManager.ROLES.CASHIER]: 1
        };

        return roleHierarchy[user.role] > roleHierarchy[targetRole];
    }

    // Get all users (filtered by permission)
    getUsers() {
        const usersJson = localStorage.getItem(this.USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Hash password (in production, use a proper hashing algorithm)
    hashPassword(password) {
        // This is a simple hash for demonstration
        // In production, use bcrypt or similar
        return btoa(password);
    }

    // Remove sensitive data from user object
    sanitizeUser(user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Event handlers
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const user = await authManager.login(username, password);
        showScreen('dashboard');
        updateUIForRole(user.role);
    } catch (error) {
        showError(error.message);
    }
}

// Update UI based on user role
function updateUIForRole(role) {
    const permissions = AuthManager.PERMISSIONS[role];
    const modules = document.querySelectorAll('nav button');

    modules.forEach(module => {
        const moduleId = module.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (permissions.includes('all') || permissions.includes(moduleId)) {
            module.style.display = 'flex';
        } else {
            module.style.display = 'none';
        }
    });
}

// Error display function
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
    errorElement.innerHTML = message;
    
    const container = document.querySelector('#loginScreen .bg-white');
    container.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginScreen form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
