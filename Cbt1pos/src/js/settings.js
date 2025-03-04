// Settings Management System
class SettingsManager {
    constructor() {
        this.SETTINGS_KEY = 'cbt1pos_settings';
        this.CATEGORIES_KEY = 'cbt1pos_categories';
        this.currentSection = 'business';
    }

    // Initialize settings module
    async init() {
        await this.loadSettingsInterface();
    }

    // Load settings interface
    async loadSettingsInterface() {
        const moduleContent = document.getElementById('moduleContent');
        moduleContent.innerHTML = `
            <div class="space-y-4">
                <!-- Navigation Tabs -->
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8">
                        <button onclick="settingsManager.switchSection('business')"
                                class="tab-button" data-section="business">
                            <i class="fas fa-building mr-2"></i>Negocio
                        </button>
                        <button onclick="settingsManager.switchSection('categories')"
                                class="tab-button" data-section="categories">
                            <i class="fas fa-tags mr-2"></i>Categorías
                        </button>
                        <button onclick="settingsManager.switchSection('taxes')"
                                class="tab-button" data-section="taxes">
                            <i class="fas fa-percent mr-2"></i>Impuestos
                        </button>
                        <button onclick="settingsManager.switchSection('backup')"
                                class="tab-button" data-section="backup">
                            <i class="fas fa-database mr-2"></i>Respaldo
                        </button>
                    </nav>
                </div>

                <!-- Content Area -->
                <div id="settingsContent" class="bg-white p-4 rounded-lg shadow">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>

            <!-- Category Form Modal -->
            <div id="categoryModal" class="fixed inset-0 bg-black bg-opacity-50 hidden">
                <div class="bg-white rounded-lg w-2/3 mx-auto mt-10 p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Categoría</h3>
                        <button onclick="settingsManager.closeCategoryModal()" class="text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="categoryForm" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" id="categoryName" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Código</label>
                                <input type="text" id="categoryCode" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea id="categoryDescription" rows="3"
                                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" onclick="settingsManager.closeCategoryModal()"
                                    class="px-4 py-2 border rounded-lg">
                                Cancelar
                            </button>
                            <button type="submit"
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        // Style active tab
        this.updateTabs();

        // Load initial section
        await this.showBusinessSettings();
    }

    // Switch between sections
    async switchSection(section) {
        this.currentSection = section;
        this.updateTabs();

        switch (section) {
            case 'business':
                await this.showBusinessSettings();
                break;
            case 'categories':
                await this.showCategories();
                break;
            case 'taxes':
                await this.showTaxSettings();
                break;
            case 'backup':
                await this.showBackupSettings();
                break;
        }
    }

    // Update tab styles
    updateTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            const section = tab.dataset.section;
            if (section === this.currentSection) {
                tab.classList.add('border-blue-500', 'text-blue-600');
                tab.classList.remove('text-gray-500', 'hover:text-gray-700');
            } else {
                tab.classList.remove('border-blue-500', 'text-blue-600');
                tab.classList.add('text-gray-500', 'hover:text-gray-700');
            }
        });
    }

    // Show business settings
    async showBusinessSettings() {
        const settings = JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}');
        const content = document.getElementById('settingsContent');

        content.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Información del Negocio</h3>
                <form id="businessForm" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
                            <input type="text" id="businessName" value="${settings.businessName || ''}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">RIF</label>
                            <input type="text" id="businessRif" value="${settings.businessRif || ''}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="tel" id="businessPhone" value="${settings.businessPhone || ''}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="businessEmail" value="${settings.businessEmail || ''}"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700">Dirección</label>
                            <textarea id="businessAddress" rows="3"
                                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">${settings.businessAddress || ''}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Logo</label>
                            <input type="file" id="businessLogo" accept="image/*"
                                   class="mt-1 block w-full">
                            ${settings.businessLogo ? `
                                <img src="${settings.businessLogo}" alt="Logo" class="mt-2 h-20 object-contain">
                            ` : ''}
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Moneda</label>
                            <select id="businessCurrency"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="USD" ${settings.businessCurrency === 'USD' ? 'selected' : ''}>USD</option>
                                <option value="VES" ${settings.businessCurrency === 'VES' ? 'selected' : ''}>VES</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <button type="submit"
                                class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add event listener for form submission
        document.getElementById('businessForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBusinessSettings();
        });

        // Add event listener for logo upload
        document.getElementById('businessLogo').addEventListener('change', (e) => {
            this.handleLogoUpload(e);
        });
    }

    // Show categories
    async showCategories() {
        const categories = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY) || '[]');
        const content = document.getElementById('settingsContent');

        content.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Categorías</h3>
                    <button onclick="settingsManager.showCategoryModal()"
                            class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Nueva Categoría
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Código
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${categories.map(category => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">${category.code}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">${category.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">${category.description || '-'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button onclick="settingsManager.editCategory('${category.id}')"
                                                class="text-blue-600 hover:text-blue-900">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="settingsManager.deleteCategory('${category.id}')"
                                                class="ml-2 text-red-600 hover:text-red-900">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Show tax settings
    async showTaxSettings() {
        const settings = JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}');
        const content = document.getElementById('settingsContent');

        content.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Configuración de Impuestos</h3>
                <form id="taxForm" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">IVA (%)</label>
                            <input type="number" id="taxIva" value="${settings.taxIva || 16}" step="0.01"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">IGTF (%)</label>
                            <input type="number" id="taxIgtf" value="${settings.taxIgtf || 3}" step="0.01"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <button type="submit"
                                class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add event listener for form submission
        document.getElementById('taxForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTaxSettings();
        });
    }

    // Show backup settings
    async showBackupSettings() {
        const content = document.getElementById('settingsContent');

        content.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Respaldo y Restauración</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 border rounded-lg">
                        <h4 class="font-medium mb-2">Crear Respaldo</h4>
                        <p class="text-sm text-gray-600 mb-4">
                            Descarga una copia de seguridad de todos los datos del sistema.
                        </p>
                        <button onclick="settingsManager.createBackup()"
                                class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
                            <i class="fas fa-download mr-2"></i>Descargar Respaldo
                        </button>
                    </div>
                    <div class="p-4 border rounded-lg">
                        <h4 class="font-medium mb-2">Restaurar Respaldo</h4>
                        <p class="text-sm text-gray-600 mb-4">
                            Restaura los datos del sistema desde un archivo de respaldo.
                        </p>
                        <input type="file" id="backupFile" accept=".json"
                               class="block w-full mb-2">
                        <button onclick="settingsManager.restoreBackup()"
                                class="w-full px-4 py-2 bg-green-500 text-white rounded-lg">
                            <i class="fas fa-upload mr-2"></i>Restaurar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Save methods
    async saveBusinessSettings() {
        const formData = new FormData(document.getElementById('businessForm'));
        const settings = JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}');

        settings.businessName = formData.get('businessName');
        settings.businessRif = formData.get('businessRif');
        settings.businessPhone = formData.get('businessPhone');
        settings.businessEmail = formData.get('businessEmail');
        settings.businessAddress = formData.get('businessAddress');
        settings.businessCurrency = formData.get('businessCurrency');

        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        alert('Configuración guardada exitosamente');
    }

    async handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const settings = JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}');
                settings.businessLogo = e.target.result;
                localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
                this.showBusinessSettings();
            };
            reader.readAsDataURL(file);
        }
    }

    saveCategory() {
        const formData = new FormData(document.getElementById('categoryForm'));
        
        const category = {
            id: this.editingId || Date.now().toString(),
            name: formData.get('categoryName'),
            code: formData.get('categoryCode'),
            description: formData.get('categoryDescription'),
            created: new Date().toISOString()
        };

        const categories = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY) || '[]');
        
        if (this.editingId) {
            const index = categories.findIndex(c => c.id === this.editingId);
            if (index !== -1) {
                categories[index] = { ...categories[index], ...category };
            }
        } else {
            categories.push(category);
        }

        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        this.closeCategoryModal();
        this.showCategories();
    }

    saveTaxSettings() {
        const formData = new FormData(document.getElementById('taxForm'));
        const settings = JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}');

        settings.taxIva = parseFloat(formData.get('taxIva'));
        settings.taxIgtf = parseFloat(formData.get('taxIgtf'));

        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        alert('Configuración de impuestos guardada exitosamente');
    }

    // Backup methods
    createBackup() {
        const backup = {
            settings: JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}'),
            categories: JSON.parse(localStorage.getItem(this.CATEGORIES_KEY) || '[]'),
            products: JSON.parse(localStorage.getItem('products') || '[]'),
            inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
            sales: JSON.parse(localStorage.getItem('sales') || '[]'),
            customers: JSON.parse(localStorage.getItem('customers') || '[]'),
            contracts: JSON.parse(localStorage.getItem('contracts') || '[]'),
            waste: JSON.parse(localStorage.getItem('waste') || '[]'),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async restoreBackup() {
        const file = document.getElementById('backupFile').files[0];
        if (!file) {
            alert('Seleccione un archivo de respaldo');
            return;
        }

        try {
            const backup = await this.readBackupFile(file);
            
            if (!confirm('¿Está seguro de restaurar el respaldo? Esto reemplazará todos los datos actuales.')) {
                return;
            }

            // Restore all data
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(backup.settings));
            localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(backup.categories));
            localStorage.setItem('products', JSON.stringify(backup.products));
            localStorage.setItem('inventory', JSON.stringify(backup.inventory));
            localStorage.setItem('sales', JSON.stringify(backup.sales));
            localStorage.setItem('customers', JSON.stringify(backup.customers));
            localStorage.setItem('contracts', JSON.stringify(backup.contracts));
            localStorage.setItem('waste', JSON.stringify(backup.waste));

            alert('Respaldo restaurado exitosamente');
            location.reload();
        } catch (error) {
            alert('Error al restaurar el respaldo: ' + error.message);
        }
    }

    // Helper methods
    async readBackupFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    resolve(backup);
                } catch (error) {
                    reject(new Error('Archivo de respaldo inválido'));
                }
            };
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file);
        });
    }

    showCategoryModal() {
        document.getElementById('categoryModal').classList.remove('hidden');
    }

    closeCategoryModal() {
        document.getElementById('categoryModal').classList.add('hidden');
        document.getElementById('categoryForm').reset();
        this.editingId = null;
    }

    editCategory(id) {
        const categories = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY) || '[]');
        const category = categories.find(c => c.id === id);
        if (!category) return;

        this.editingId = id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryCode').value = category.code;
        document.getElementById('categoryDescription').value = category.description || '';

        this.showCategoryModal();
    }

    deleteCategory(id) {
        if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

        const categories = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY) || '[]');
        const filtered = categories.filter(c => c.id !== id);
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(filtered));
        this.showCategories();
    }
}

// Initialize settings manager
const settingsManager = new SettingsManager();

// Load settings module
function loadSettingsModule() {
    settingsManager.init();
}
