// License management system
class LicenseManager {
    constructor() {
        this.LICENSE_LENGTH = 6;
        this.ADMIN_SECRET = 'ADMIN123'; // In production, this should be stored securely
        this.LICENSE_KEY = 'cbt1pos_license';
        this.LICENSE_EXPIRY_KEY = 'cbt1pos_license_expiry';
    }

    // Generate a new license key (admin only)
    generateLicense(adminKey, expiryDays = 365) {
        if (adminKey !== this.ADMIN_SECRET) {
            throw new Error('Acceso no autorizado para generar licencia');
        }

        // Generate a random 6-digit number
        const license = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Calculate expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);

        return {
            license,
            expiryDate: expiryDate.toISOString()
        };
    }

    // Validate a license key
    validateLicense(licenseKey) {
        // Basic format validation
        if (!this.isValidFormat(licenseKey)) {
            return {
                valid: false,
                message: 'Formato de licencia inválido'
            };
        }

        // In a real application, this would validate against a server
        // For demo purposes, we'll use a simple validation
        const isValid = this.checkLicenseValidity(licenseKey);

        if (isValid) {
            // Store the license
            this.storeLicense(licenseKey);
            return {
                valid: true,
                message: 'Licencia válida'
            };
        }

        return {
            valid: false,
            message: 'Licencia inválida'
        };
    }

    // Check if license format is valid
    isValidFormat(license) {
        return typeof license === 'string' && 
               license.length === this.LICENSE_LENGTH && 
               /^\d+$/.test(license);
    }

    // Check if license is valid (demo implementation)
    checkLicenseValidity(license) {
        // In a real application, this would check against a server
        // For demo, we'll consider any 6-digit number valid
        return this.isValidFormat(license);
    }

    // Store license in localStorage
    storeLicense(license) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year validity

        localStorage.setItem(this.LICENSE_KEY, license);
        localStorage.setItem(this.LICENSE_EXPIRY_KEY, expiryDate.toISOString());
    }

    // Check if license exists and is valid
    checkExistingLicense() {
        const license = localStorage.getItem(this.LICENSE_KEY);
        const expiryDate = localStorage.getItem(this.LICENSE_EXPIRY_KEY);

        if (!license || !expiryDate) {
            return {
                valid: false,
                message: 'No se encontró licencia'
            };
        }

        // Check expiry
        if (new Date(expiryDate) < new Date()) {
            this.removeLicense();
            return {
                valid: false,
                message: 'Licencia expirada'
            };
        }

        return {
            valid: true,
            message: 'Licencia válida',
            expiryDate: expiryDate
        };
    }

    // Remove license from localStorage
    removeLicense() {
        localStorage.removeItem(this.LICENSE_KEY);
        localStorage.removeItem(this.LICENSE_EXPIRY_KEY);
    }

    // Get days remaining in license
    getDaysRemaining() {
        const expiryDate = localStorage.getItem(this.LICENSE_EXPIRY_KEY);
        if (!expiryDate) return 0;

        const remaining = new Date(expiryDate) - new Date();
        return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
    }
}

// Initialize license manager
const licenseManager = new LicenseManager();

// Event handlers
function handleLicenseSubmit() {
    const licenseInput = document.getElementById('licenseKey');
    const license = licenseInput.value.trim();

    try {
        const result = licenseManager.validateLicense(license);
        if (result.valid) {
            showScreen('loginScreen');
        } else {
            showError(result.message);
        }
    } catch (error) {
        showError(error.message);
    }
}

// Admin license generation interface
function showAdminLicenseGenerator() {
    const adminKey = prompt('Ingrese la clave de administrador:');
    if (!adminKey) return;

    try {
        const result = licenseManager.generateLicense(adminKey);
        alert(`Nueva licencia generada: ${result.license}\nExpira: ${new Date(result.expiryDate).toLocaleDateString()}`);
    } catch (error) {
        alert(error.message);
    }
}

// Check license status periodically
setInterval(() => {
    const licenseStatus = licenseManager.checkExistingLicense();
    if (!licenseStatus.valid) {
        showScreen('licenseScreen');
    }
}, 3600000); // Check every hour

// Error display function
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
    errorElement.innerHTML = message;
    
    const container = document.querySelector('#licenseScreen .bg-white');
    container.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}
