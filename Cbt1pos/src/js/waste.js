// Waste (Merma) Management System
class WasteManager {
    constructor() {
        this.WASTE_KEY = 'cbt1pos_waste';
        this.currentSection = 'meat';
        this.editingId = null;
    }

    // Initialize waste module
    async init() {
        await this.loadWasteInterface();
    }

    // Show/hide modals
    showWasteModal(type) {
        document.getElementById('wasteModal').classList.remove('hidden');
        document.getElementById('wasteType').value = type;
        this.loadProductsForType(type);
    }

    closeWasteModal() {
        document.getElementById('wasteModal').classList.add('hidden');
        document.getElementById('wasteForm').reset();
        this.editingId = null;
    }

    // Save waste
    saveWaste() {
        const formData = new FormData(document.getElementById('wasteForm'));
        
        const waste = {
            id: this.editingId || Date.now().toString(),
            date: formData.get('wasteDate'),
            type: formData.get('wasteType'),
            product: formData.get('wasteProduct'),
            initialQuantity: parseFloat(formData.get('initialQuantity')),
            finalQuantity: parseFloat(formData.get('finalQuantity')),
            unit: formData.get('wasteUnit'),
            notes: formData.get('wasteNotes'),
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        const wastes = JSON.parse(localStorage.getItem(this.WASTE_KEY) || '[]');
        
        if (this.editingId) {
            const index = wastes.findIndex(w => w.id === this.editingId);
            if (index !== -1) {
                wastes[index] = { ...wastes[index], ...waste };
            }
        } else {
            wastes.push(waste);
        }

        localStorage.setItem(this.WASTE_KEY, JSON.stringify(wastes));
        this.closeWasteModal();
        this.switchSection(waste.type);
    }

    // Delete waste
    deleteWaste(id) {
        if (!confirm('¿Está seguro de eliminar este registro?')) return;

        const wastes = JSON.parse(localStorage.getItem(this.WASTE_KEY) || '[]');
        const waste = wastes.find(w => w.id === id);
        const filtered = wastes.filter(w => w.id !== id);
        localStorage.setItem(this.WASTE_KEY, JSON.stringify(filtered));
        this.switchSection(waste.type);
    }

    // Edit waste
    editWaste(id) {
        const wastes = JSON.parse(localStorage.getItem(this.WASTE_KEY) || '[]');
        const waste = wastes.find(w => w.id === id);
        if (!waste) return;

        this.editingId = id;
        document.getElementById('wasteDate').value = waste.date;
        document.getElementById('wasteType').value = waste.type;
        document.getElementById('wasteProduct').value = waste.product;
        document.getElementById('initialQuantity').value = waste.initialQuantity;
        document.getElementById('finalQuantity').value = waste.finalQuantity;
        document.getElementById('wasteUnit').value = waste.unit;
        document.getElementById('wasteNotes').value = waste.notes || '';

        this.showWasteModal(waste.type);
    }

    // Filter waste
    filterWaste(type, date) {
        const wastes = JSON.parse(localStorage.getItem(this.WASTE_KEY) || '[]');
        const filtered = wastes.filter(w => 
            w.type === type && 
            (!date || w.date === date)
        );
        this.updateWasteTable(filtered);
    }

    // Generate report
    generateWasteReport(type) {
        const wastes = JSON.parse(localStorage.getItem(this.WASTE_KEY) || '[]')
            .filter(w => w.type === type);

        const reportContent = `
            <div class="text-center">
                <h2 class="text-xl font-bold">Reporte de Merma - ${this.getWasteTypeName(type)}</h2>
                <p class="text-sm">${new Date().toLocaleDateString()}</p>
                <div class="divider"></div>
                <table class="w-full text-left mt-4">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Producto</th>
                            <th>Inicial</th>
                            <th>Final</th>
                            <th>Merma</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${wastes.map(w => {
                            const wasteDiff = w.initialQuantity - w.finalQuantity;
                            const wastePercentage = (wasteDiff / w.initialQuantity * 100).toFixed(2);
                            return `
                                <tr>
                                    <td>${new Date(w.date).toLocaleDateString()}</td>
                                    <td>${w.product}</td>
                                    <td>${w.initialQuantity} ${w.unit}</td>
                                    <td>${w.finalQuantity} ${w.unit}</td>
                                    <td>${wasteDiff.toFixed(2)} ${w.unit}</td>
                                    <td>${wastePercentage}%</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div class="divider"></div>
                <div class="text-right mt-4">
                    <p><strong>Total Merma:</strong> ${this.calculateTotalWaste(wastes)} unidades</p>
                    <p><strong>Promedio Merma:</strong> ${this.calculateAverageWaste(wastes)}%</p>
                </div>
            </div>
        `;

        printTicket(reportContent);
    }

    // Helper methods
    getWasteTypeName(type) {
        const types = {
            meat: 'Carne',
            water: 'Agua',
            deli: 'Charcutería'
        };
        return types[type] || type;
    }

    calculateTotalWaste(wastes) {
        return wastes.reduce((total, w) => total + (w.initialQuantity - w.finalQuantity), 0).toFixed(2);
    }

    calculateAverageWaste(wastes) {
        if (wastes.length === 0) return '0.00';
        const totalPercentage = wastes.reduce((total, w) => {
            const wasteDiff = w.initialQuantity - w.finalQuantity;
            const percentage = (wasteDiff / w.initialQuantity) * 100;
            return total + percentage;
        }, 0);
        return (totalPercentage / wastes.length).toFixed(2);
    }

    loadProductsForType(type) {
        const products = {
            meat: ['Carne de Res', 'Pollo', 'Cerdo', 'Cordero'],
            water: ['Agua Mineral', 'Agua Purificada'],
            deli: ['Jamón', 'Queso', 'Salchichón', 'Mortadela']
        };

        const select = document.getElementById('wasteProduct');
        select.innerHTML = '<option value="">Seleccionar producto</option>' +
            products[type].map(p => `<option value="${p}">${p}</option>`).join('');
    }

    updateWasteTable(wastes) {
        const tbody = document.querySelector('#wasteContent table tbody');
        tbody.innerHTML = wastes.map(w => {
            const wasteDiff = w.initialQuantity - w.finalQuantity;
            const wastePercentage = (wasteDiff / w.initialQuantity * 100).toFixed(2);
            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${new Date(w.date).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">${w.product}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${w.initialQuantity} ${w.unit}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${w.finalQuantity} ${w.unit}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${wasteDiff.toFixed(2)} ${w.unit}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${wastePercentage}%
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button onclick="wasteManager.editWaste('${w.id}')"
                                class="text-blue-600 hover:text-blue-900">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="wasteManager.deleteWaste('${w.id}')"
                                class="ml-2 text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Initialize waste manager
const wasteManager = new WasteManager();

// Load waste module
function loadWasteModule() {
    wasteManager.init();
}
