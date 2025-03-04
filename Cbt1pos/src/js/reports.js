// Reports Management System
class ReportsManager {
    constructor() {
        this.SALES_KEY = 'cbt1pos_sales';
        this.INVENTORY_KEY = 'cbt1pos_inventory';
        this.WASTE_KEY = 'cbt1pos_waste';
        this.currentSection = 'sales';
    }

    // Initialize reports module
    async init() {
        await this.loadReportsInterface();
    }

    // Helper methods
    getPaymentMethodName(method) {
        const methods = {
            cash_bs: 'Efectivo Bs.',
            cash_usd: 'Efectivo USD',
            debit: 'Tarjeta de Débito',
            biopago: 'Biopago'
        };
        return methods[method] || method;
    }

    getWasteTypeName(type) {
        const types = {
            meat: 'Carne',
            water: 'Agua',
            deli: 'Charcutería'
        };
        return types[type] || type;
    }

    getDayName(day) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[day % 7];
    }

    // Chart initialization methods
    initializeSalesChart(sales) {
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        // Group sales by date
        const salesByDate = sales.reduce((acc, sale) => {
            const date = new Date(sale.date).toLocaleDateString();
            acc[date] = (acc[date] || 0) + sale.total;
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(salesByDate),
                datasets: [{
                    label: 'Ventas Diarias',
                    data: Object.values(salesByDate),
                    borderColor: '#3B82F6',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + value
                        }
                    }
                }
            }
        });
    }

    initializeInventoryChart(inventory, products) {
        const ctx = document.getElementById('inventoryChart').getContext('2d');
        
        // Group inventory by product category
        const stockByCategory = inventory.reduce((acc, item) => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                acc[product.group] = (acc[product.group] || 0) + item.quantity;
            }
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(stockByCategory),
                datasets: [{
                    label: 'Stock por Categoría',
                    data: Object.values(stockByCategory),
                    backgroundColor: [
                        '#3B82F6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initializeWasteChart(waste) {
        const ctx = document.getElementById('wasteChart').getContext('2d');
        
        // Group waste by type
        const wasteByType = waste.reduce((acc, w) => {
            acc[w.type] = (acc[w.type] || 0) + (w.initialQuantity - w.finalQuantity);
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(wasteByType).map(type => this.getWasteTypeName(type)),
                datasets: [{
                    data: Object.values(wasteByType),
                    backgroundColor: [
                        '#EF4444',
                        '#3B82F6',
                        '#F59E0B'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    initializeContractsChart(contracts) {
        const ctx = document.getElementById('contractsChart').getContext('2d');
        
        // Group contracts by delivery day
        const contractsByDay = contracts.reduce((acc, contract) => {
            if (contract.status === 'active') {
                acc[contract.deliveryDay] = (acc[contract.deliveryDay] || 0) + 1;
            }
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(contractsByDay).map(day => this.getDayName(parseInt(day))),
                datasets: [{
                    label: 'Contratos por Día',
                    data: Object.values(contractsByDay),
                    backgroundColor: '#3B82F6'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Export methods
    exportSalesReport() {
        const sales = JSON.parse(localStorage.getItem(this.SALES_KEY) || '[]');
        
        const data = sales.map(sale => ({
            'Fecha': new Date(sale.date).toLocaleDateString(),
            'Cliente': sale.customer?.name || 'Cliente General',
            'Artículos': sale.items.reduce((sum, item) => sum + item.quantity, 0),
            'Total': sale.total.toFixed(2),
            'Método de Pago': this.getPaymentMethodName(sale.paymentMethod)
        }));

        this.downloadExcel(data, 'reporte_ventas.xlsx');
    }

    exportInventoryReport() {
        const inventory = JSON.parse(localStorage.getItem(this.INVENTORY_KEY) || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        const data = inventory.map(item => {
            const product = products.find(p => p.id === item.productId);
            const value = (item.quantity * (product?.cost || 0)).toFixed(2);
            return {
                'Código': product?.code || '-',
                'Producto': product?.name || '-',
                'Stock': item.quantity,
                'Almacén': item.warehouse,
                'Valor': value,
                'Estado': item.quantity <= 10 ? 'Stock Bajo' : 'Normal'
            };
        });

        this.downloadExcel(data, 'reporte_inventario.xlsx');
    }

    exportWasteReport() {
        const waste = JSON.parse(localStorage.getItem(this.WASTE_KEY) || '[]');
        
        const data = waste.map(w => {
            const wasteDiff = w.initialQuantity - w.finalQuantity;
            const wastePercentage = (wasteDiff / w.initialQuantity * 100).toFixed(2);
            return {
                'Fecha': new Date(w.date).toLocaleDateString(),
                'Tipo': this.getWasteTypeName(w.type),
                'Producto': w.product,
                'Cantidad Inicial': `${w.initialQuantity} ${w.unit}`,
                'Cantidad Final': `${w.finalQuantity} ${w.unit}`,
                'Merma': `${wasteDiff.toFixed(2)} ${w.unit}`,
                '% Merma': `${wastePercentage}%`
            };
        });

        this.downloadExcel(data, 'reporte_merma.xlsx');
    }

    exportContractsReport() {
        const contracts = JSON.parse(localStorage.getItem('cbt1pos_contracts') || '[]');
        
        const data = contracts.map(contract => ({
            'Cliente': contract.customerName,
            'Plan': contract.planType,
            'Costo': contract.planCost,
            'Estado': contract.status === 'active' ? 'Activo' : 'Inactivo',
            'Deuda': contract.debt > 0 ? contract.debt : 'Sin deuda',
            'Día Entrega': this.getDayName(contract.deliveryDay)
        }));

        this.downloadExcel(data, 'reporte_contratos.xlsx');
    }

    // Utility methods
    downloadExcel(data, filename) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
        XLSX.writeFile(workbook, filename);
    }
}

// Initialize reports manager
const reportsManager = new ReportsManager();

// Load reports module
function loadReportsModule() {
    reportsManager.init();
}
