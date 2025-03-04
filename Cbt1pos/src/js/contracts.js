// Contracts Management System
class ContractsManager {
    constructor() {
        this.CONTRACTS_KEY = 'cbt1pos_contracts';
        this.PLANS_KEY = 'cbt1pos_plans';
    }

    // Initialize contracts module
    async init() {
        await this.loadContractsInterface();
    }

    // Load contracts interface
    async loadContractsInterface() {
        const moduleContent = document.getElementById('moduleContent');
        moduleContent.innerHTML = `
            <div class="space-y-4">
                <!-- Contracts Navigation -->
                <div class="bg-white p-4 rounded-lg shadow">
                    <div class="grid grid-cols-4 gap-4">
                        <button onclick="contractsManager.showContractForm()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-file-contract text-2xl text-blue-500"></i>
                            <p class="mt-2">Nuevo Contrato</p>
                        </button>
                        <button onclick="contractsManager.showContractsList()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-list text-2xl text-blue-500"></i>
                            <p class="mt-2">Ver Contratos</p>
                        </button>
                        <button onclick="contractsManager.showImportExport()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-file-import text-2xl text-blue-500"></i>
                            <p class="mt-2">Importar/Exportar</p>
                        </button>
                        <button onclick="contractsManager.showDeliverySchedule()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-truck text-2xl text-blue-500"></i>
                            <p class="mt-2">Programación Entregas</p>
                        </button>
                    </div>
                </div>

                <!-- Content Area -->
                <div id="contractsContent" class="bg-white p-4 rounded-lg shadow">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>

            <!-- Contract Form Modal -->
            <div id="contractModal" class="fixed inset-0 bg-black bg-opacity-50 hidden">
                <div class="bg-white rounded-lg w-2/3 mx-auto mt-10 p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Nuevo Contrato</h3>
                        <button onclick="contractsManager.closeContractModal()" class="text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="contractForm" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Cliente -->
                            <div class="col-span-2">
                                <h4 class="font-medium mb-2">Información del Cliente</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Nombre y Apellido</label>
                                        <input type="text" id="customerName" required
                                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">CI/RIF</label>
                                        <input type="text" id="customerRif" required
                                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <input type="tel" id="customerPhone" required
                                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Dirección</label>
                                        <input type="text" id="customerAddress" required
                                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    </div>
                                </div>
                            </div>

                            <!-- Plan -->
                            <div class="col-span-2">
                                <h4 class="font-medium mb-2">Información del Plan</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Plan</label>
                                        <select id="planType" required
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                            <!-- Plans will be loaded dynamically -->
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Costo del Plan</label>
                                        <input type="number" id="planCost" step="0.01" required
                                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Día de Entrega</label>
                                        <select id="deliveryDay" required
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                            <option value="1">Lunes</option>
                                            <option value="2">Martes</option>
                                            <option value="3">Miércoles</option>
                                            <option value="4">Jueves</option>
                                            <option value="5">Viernes</option>
                                            <option value="6">Sábado</option>
                                            <option value="7">Domingo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Estado</label>
                                        <div class="mt-2">
                                            <label class="inline-flex items-center">
                                                <input type="radio" name="status" value="active" checked
                                                       class="form-radio text-blue-600">
                                                <span class="ml-2">Activo</span>
                                            </label>
                                            <label class="inline-flex items-center ml-6">
                                                <input type="radio" name="status" value="inactive"
                                                       class="form-radio text-blue-600">
                                                <span class="ml-2">Inactivo</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" onclick="contractsManager.closeContractModal()"
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

            <!-- Import/Export Modal -->
            <div id="importExportModal" class="fixed inset-0 bg-black bg-opacity-50 hidden">
                <div class="bg-white rounded-lg w-96 mx-auto mt-20 p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Importar/Exportar Contratos</h3>
                        <button onclick="contractsManager.closeImportExportModal()" class="text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-medium mb-2">Importar</h4>
                            <input type="file" id="importFile" accept=".xlsx,.xls,.csv"
                                   class="block w-full">
                            <button onclick="contractsManager.importContracts()"
                                    class="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Importar
                            </button>
                        </div>
                        <div class="border-t pt-4">
                            <h4 class="font-medium mb-2">Exportar</h4>
                            <button onclick="contractsManager.exportContracts()"
                                    class="w-full px-4 py-2 bg-green-500 text-white rounded-lg">
                                Exportar Contratos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('contractForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContract();
        });

        // Load initial contracts list
        await this.showContractsList();
    }

    // Show contracts list
    async showContractsList() {
        const contracts = JSON.parse(localStorage.getItem(this.CONTRACTS_KEY) || '[]');
        const content = document.getElementById('contractsContent');

        content.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Contratos</h3>
                    <div class="flex space-x-2">
                        <input type="text" id="searchContract" placeholder="Buscar..."
                               class="px-4 py-2 border rounded-lg">
                        <select id="filterStatus" class="px-4 py-2 border rounded-lg">
                            <option value="">Todos</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CI/RIF
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Día Entrega
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deuda
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${contracts.map(contract => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">${contract.customerName}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">${contract.customerRif}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">${contract.planType}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">${this.getDayName(contract.deliveryDay)}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                            ${contract.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${contract.debt > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                                            ${contract.debt > 0 ? `$${contract.debt}` : 'Solvente'}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button onclick="contractsManager.editContract('${contract.id}')"
                                                class="text-blue-600 hover:text-blue-900">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="contractsManager.deleteContract('${contract.id}')"
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

        // Add event listeners for search and filter
        document.getElementById('searchContract').addEventListener('input', (e) => {
            this.filterContracts(e.target.value);
        });

        document.getElementById('filterStatus').addEventListener('change', (e) => {
            this.filterContracts(document.getElementById('searchContract').value, e.target.value);
        });
    }

    // Show delivery schedule
    showDeliverySchedule() {
        const contracts = JSON.parse(localStorage.getItem(this.CONTRACTS_KEY) || '[]')
            .filter(c => c.status === 'active');
        
        const content = document.getElementById('contractsContent');
        const today = new Date().getDay() || 7; // Convert Sunday from 0 to 7

        content.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Programación de Entregas</h3>
                <div class="grid grid-cols-7 gap-4">
                    ${[1,2,3,4,5,6,7].map(day => `
                        <div class="border rounded-lg p-4 ${day === today ? 'bg-blue-50' : ''}">
                            <h4 class="font-medium mb-2">${this.getDayName(day)}</h4>
                            <div class="space-y-2">
                                ${contracts.filter(c => c.deliveryDay === day).map(contract => `
                                    <div class="bg-white p-2 rounded border">
                                        <p class="font-medium">${contract.customerName}</p>
                                        <p class="text-sm text-gray-600">${contract.planType}</p>
                                        <p class="text-sm text-gray-600">${contract.customerPhone}</p>
                                        <p class="text-xs text-gray-500">${contract.customerAddress}</p>
                                    </div>
                                `).join('') || '<p class="text-gray-500">No hay entregas</p>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="flex justify-end">
                    <button onclick="contractsManager.printDeliverySchedule()"
                            class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        <i class="fas fa-print mr-2"></i>Imprimir
                    </button>
                </div>
            </div>
        `;
    }

    // Print delivery schedule
    printDeliverySchedule() {
        const contracts = JSON.parse(localStorage.getItem(this.CONTRACTS_KEY) || '[]')
            .filter(c => c.status === 'active');
        
        const today = new Date().getDay() || 7;
        const todayContracts = contracts.filter(c => c.deliveryDay === today);

        const content = `
            <div class="text-center">
                <h2 class="text-xl font-bold">Programación de Entregas</h2>
                <p class="text-sm">${new Date().toLocaleDateString()}</p>
                <p class="text-sm">${this.getDayName(today)}</p>
                <div class="divider"></div>
                ${todayContracts.map(contract => `
                    <div class="text-left mb-4">
                        <p><strong>Cliente:</strong> ${contract.customerName}</p>
                        <p><strong>Plan:</strong> ${contract.planType}</p>
                        <p><strong>Teléfono:</strong> ${contract.customerPhone}</p>
                        <p><strong>Dirección:</strong> ${contract.customerAddress}</p>
                    </div>
                `).join('<div class="divider"></div>')}
            </div>
        `;

        printTicket(content);
    }

    // Save contract
    saveContract() {
        const formData = new FormData(document.getElementById('contractForm'));
        
        const contract = {
            id: Date.now().toString(),
            customerName: formData.get('customerName'),
            customerRif: formData.get('customerRif'),
            customerPhone: formData.get('customerPhone'),
            customerAddress: formData.get('customerAddress'),
            planType: formData.get('planType'),
            planCost: parseFloat(formData.get('planCost')),
            deliveryDay: parseInt(formData.get('deliveryDay')),
            status: formData.get('status'),
            debt: 0,
            created: new Date().toISOString()
        };

        const contracts = JSON.parse(localStorage.getItem(this.CONTRACTS_KEY) || '[]');
        contracts.push(contract);
        localStorage.setItem(this.CONTRACTS_KEY, JSON.stringify(contracts));

        this.closeContractModal();
        this.showContractsList();
    }

    // Import contracts
    async importContracts() {
        const file = document.getElementById('importFile').files[0];
        if (!file) {
            alert('Seleccione un archivo');
            return;
        }

        try {
            const data = await this.readExcelFile(file);
            // Process data and update contracts
            this.updateContractsFromImport(data);
            this.closeImportExportModal();
            this.showContractsList();
        } catch (error) {
            alert('Error al importar: ' + error.message);
        }
    }

    // Export contracts
    exportContracts() {
        const contracts = JSON.parse(localStorage.getItem(this.CONTRACTS_KEY) || '[]');
        
        const data = contracts.map(contract => ({
            'Cliente': contract.customerName,
            'CI/RIF': contract.customerRif,
            'Teléfono': contract.customerPhone,
            'Dirección': contract.customerAddress,
            'Plan': contract.planType,
            'Costo': contract.planCost,
            'Día Entrega': this.getDayName(contract.deliveryDay),
            'Estado': contract.status === 'active' ? 'Activo' : 'Inactivo',
            'Deuda': contract.debt
        }));

        this.downloadExcel(data, 'contratos.xlsx');
    }

    // Helper methods
    getDayName(day) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[day % 7];
    }

    async readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    resolve(XLSX.utils.sheet_to_json(firstSheet));
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    downloadExcel(data, filename) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Contratos");
        XLSX.writeFile(workbook, filename);
    }

    // UI methods
    showContractForm() {
        document.getElementById('contractModal').classList.remove('hidden');
        this.loadPlans();
    }

    closeContractModal() {
        document.getElementById('contractModal').classList.add('hidden');
        document.getElementById('contractForm').reset();
    }

    showImportExport() {
        document.getElementById('importExportModal').classList.remove('hidden');
    }

    closeImportExportModal() {
        document.getElementById('importExportModal').classList.add('hidden');
    }

    loadPlans() {
        const plans = JSON.parse(localStorage.getItem(this.PLANS_KEY) || '[]');
        const planSelect = document.getElementById('planType');
        
        planSelect.innerHTML = '<option value="">Seleccionar plan</option>' +
            plans.map(plan => `<option value="${plan.id}">${plan.name}</option>`).join('');
    }

    filterContracts(search = '', status = '') {
        const contracts = JSON.parse(localStorage.getItem(this.CONTRACTS_KEY) || '[]');
        
        const filtered = contracts.filter(contract => {
            const matchesSearch = search === '' || 
                contract.customerName.toLowerCase().includes(search.toLowerCase()) ||
                contract.customerRif.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = status === '' || contract.status === status;

            return matchesSearch && matchesStatus;
        });

        this.updateContractsTable(filtered);
    }

    updateContractsTable(contracts) {
        const tbody = document.querySelector('#contractsContent table tbody');
        
        tbody.innerHTML = contracts.map(contract => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${contract.customerName}</td>
                <td class="px-6 py-4 whitespace-nowrap">${contract.customerRif}</td>
                <td class="px-6 py-4 whitespace-nowrap">${contract.planType}</td>
                <td class="px-6 py-4 whitespace-nowrap">${this.getDayName(contract.deliveryDay)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${contract.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${contract.debt > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                        ${contract.debt > 0 ? `$${contract.debt}` : 'Solvente'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onclick="contractsManager.editContract('${contract.id}')"
                            class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="contractsManager.deleteContract('${contract.id}')"
                            class="ml-2 text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Initialize contracts manager
const contractsManager = new ContractsManager();

// Load contracts module
function loadContractsModule() {
    contractsManager.init();
}
