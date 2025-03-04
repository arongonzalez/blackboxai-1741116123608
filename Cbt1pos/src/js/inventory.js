// Inventory Management System
class InventoryManager {
    constructor() {
        this.PRODUCTS_KEY = 'cbt1pos_products';
        this.INVENTORY_KEY = 'cbt1pos_inventory';
        this.CATEGORIES_KEY = 'cbt1pos_categories';
        this.WAREHOUSES_KEY = 'cbt1pos_warehouses';
    }

    // Initialize inventory module
    async init() {
        await this.loadInventoryInterface();
    }

    // Load inventory interface
    async loadInventoryInterface() {
        const moduleContent = document.getElementById('moduleContent');
        moduleContent.innerHTML = `
            <div class="space-y-4">
                <!-- Inventory Navigation -->
                <div class="bg-white p-4 rounded-lg shadow">
                    <div class="grid grid-cols-4 gap-4">
                        <button onclick="inventoryManager.showProductForm()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-plus-circle text-2xl text-blue-500"></i>
                            <p class="mt-2">Crear Producto</p>
                        </button>
                        <button onclick="inventoryManager.showInventoryList()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-boxes text-2xl text-blue-500"></i>
                            <p class="mt-2">Ver Inventario</p>
                        </button>
                        <button onclick="inventoryManager.showImportExport()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-file-import text-2xl text-blue-500"></i>
                            <p class="mt-2">Importar/Exportar</p>
                        </button>
                        <button onclick="inventoryManager.showPurchaseForm()" 
                                class="p-4 border rounded-lg hover:bg-blue-50 transition">
                            <i class="fas fa-shopping-cart text-2xl text-blue-500"></i>
                            <p class="mt-2">Registrar Compra</p>
                        </button>
                    </div>
                </div>

                <!-- Content Area -->
                <div id="inventoryContent" class="bg-white p-4 rounded-lg shadow">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>

            <!-- Product Form Modal -->
            <div id="productModal" class="fixed inset-0 bg-black bg-opacity-50 hidden">
                <div class="bg-white rounded-lg w-2/3 mx-auto mt-10 p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Crear Producto</h3>
                        <button onclick="inventoryManager.closeProductModal()" class="text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="productForm" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                                <input type="text" id="productName" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Código</label>
                                <input type="text" id="productCode" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Grupo</label>
                                <select id="productGroup" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <!-- Groups will be loaded dynamically -->
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Subgrupo</label>
                                <select id="productSubgroup"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <!-- Subgroups will be loaded dynamically -->
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Precio Costo ($)</label>
                                <input type="number" id="productCost" step="0.01" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">% Ganancia</label>
                                <input type="number" id="productProfit" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Precio Venta ($)</label>
                                <input type="number" id="productPrice" step="0.01" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">% IVA</label>
                                <input type="number" id="productTax" value="16"
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                                <select id="productUnit" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="unit">Unidad</option>
                                    <option value="weight">Peso</option>
                                    <option value="volume">Volumen</option>
                                    <option value="package">Bulto</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Imagen</label>
                                <input type="file" id="productImage" accept="image/*"
                                       class="mt-1 block w-full">
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" onclick="inventoryManager.closeProductModal()"
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
                        <h3 class="text-lg font-semibold">Importar/Exportar</h3>
                        <button onclick="inventoryManager.closeImportExportModal()" class="text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-medium mb-2">Importar</h4>
                            <input type="file" id="importFile" accept=".xlsx,.xls,.csv"
                                   class="block w-full">
                            <button onclick="inventoryManager.importInventory()"
                                    class="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Importar
                            </button>
                        </div>
                        <div class="border-t pt-4">
                            <h4 class="font-medium mb-2">Exportar</h4>
                            <button onclick="inventoryManager.exportInventory()"
                                    class="w-full px-4 py-2 bg-green-500 text-white rounded-lg">
                                Exportar Inventario
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Purchase Form Modal -->
            <div id="purchaseModal" class="fixed inset-0 bg-black bg-opacity-50 hidden">
                <div class="bg-white rounded-lg w-2/3 mx-auto mt-10 p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Registrar Compra</h3>
                        <button onclick="inventoryManager.closePurchaseModal()" class="text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="purchaseForm" class="space-y-4">
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Factura Nº</label>
                                <input type="text" id="invoiceNumber" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Fecha</label>
                                <input type="date" id="purchaseDate" required
                                       class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Proveedor</label>
                                <select id="supplier" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <!-- Suppliers will be loaded dynamically -->
                                </select>
                            </div>
                        </div>
                        <div class="border rounded-lg p-4">
                            <h4 class="font-medium mb-2">Productos</h4>
                            <div id="purchaseItems" class="space-y-2">
                                <!-- Purchase items will be added here -->
                            </div>
                            <button type="button" onclick="inventoryManager.addPurchaseItem()"
                                    class="mt-2 px-4 py-2 border rounded-lg">
                                <i class="fas fa-plus"></i> Agregar Producto
                            </button>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" onclick="inventoryManager.closePurchaseModal()"
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
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        document.getElementById('purchaseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePurchase();
        });

        // Load initial inventory list
        await this.showInventoryList();
    }

    // Show inventory list
    async showInventoryList() {
        const products = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
        const inventory = JSON.parse(localStorage.getItem(this.INVENTORY_KEY) || '[]');

        const content = document.getElementById('inventoryContent');
        content.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Inventario</h3>
                    <div class="flex space-x-2">
                        <input type="text" id="searchInventory" placeholder="Buscar..."
                               class="px-4 py-2 border rounded-lg">
                        <select id="filterWarehouse" class="px-4 py-2 border rounded-lg">
                            <option value="">Todos los almacenes</option>
                            <!-- Warehouses will be loaded dynamically -->
                        </select>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Código
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Costo
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio Venta
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Utilidad
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${products.map(product => {
                                const stock = inventory.find(i => i.productId === product.id)?.quantity || 0;
                                const utility = ((product.price - product.cost) / product.cost * 100).toFixed(2);
                                return `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">${product.code}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">${product.name}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">${stock}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">$${product.cost}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">$${product.price}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">${utility}%</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <button onclick="inventoryManager.editProduct('${product.id}')"
                                                    class="text-blue-600 hover:text-blue-900">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button onclick="inventoryManager.deleteProduct('${product.id}')"
                                                    class="ml-2 text-red-600 hover:text-red-900">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Add event listeners for search and filter
        document.getElementById('searchInventory').addEventListener('input', (e) => {
            this.filterInventory(e.target.value);
        });

        document.getElementById('filterWarehouse').addEventListener('change', (e) => {
            this.filterInventory(document.getElementById('searchInventory').value, e.target.value);
        });
    }

    // Show product form
    showProductForm() {
        document.getElementById('productModal').classList.remove('hidden');
        // Load categories and other dynamic data
        this.loadCategories();
    }

    // Close product modal
    closeProductModal() {
        document.getElementById('productModal').classList.add('hidden');
        document.getElementById('productForm').reset();
    }

    // Save product
    async saveProduct() {
        const formData = new FormData(document.getElementById('productForm'));
        const imageFile = formData.get('productImage');

        const product = {
            id: Date.now().toString(),
            name: formData.get('productName'),
            code: formData.get('productCode'),
            group: formData.get('productGroup'),
            subgroup: formData.get('productSubgroup'),
            cost: parseFloat(formData.get('productCost')),
            profit: parseFloat(formData.get('productProfit')),
            price: parseFloat(formData.get('productPrice')),
            tax: parseFloat(formData.get('productTax')),
            unit: formData.get('productUnit'),
            image: imageFile ? await this.processImage(imageFile) : null
        };

        const products = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
        products.push(product);
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));

        this.closeProductModal();
        this.showInventoryList();
    }

    // Process image
    async processImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Show import/export interface
    showImportExport() {
        document.getElementById('importExportModal').classList.remove('hidden');
    }

    // Close import/export modal
    closeImportExportModal() {
        document.getElementById('importExportModal').classList.add('hidden');
    }

    // Import inventory
    async importInventory() {
        const file = document.getElementById('importFile').files[0];
        if (!file) {
            alert('Seleccione un archivo');
            return;
        }

        try {
            const data = await this.readExcelFile(file);
            // Process data and update inventory
            this.updateInventoryFromImport(data);
            this.closeImportExportModal();
            this.showInventoryList();
        } catch (error) {
            alert('Error al importar: ' + error.message);
        }
    }

    // Export inventory
    exportInventory() {
        const products = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
        const inventory = JSON.parse(localStorage.getItem(this.INVENTORY_KEY) || '[]');

        const data = products.map(product => {
            const stock = inventory.find(i => i.productId === product.id)?.quantity || 0;
            return {
                Código: product.code,
                Producto: product.name,
                Stock: stock,
                'Precio Costo': product.cost,
                'Precio Venta': product.price,
                'Utilidad %': ((product.price - product.cost) / product.cost * 100).toFixed(2)
            };
        });

        this.downloadExcel(data, 'inventario.xlsx');
    }

    // Show purchase form
    showPurchaseForm() {
        document.getElementById('purchaseModal').classList.remove('hidden');
        this.loadSuppliers();
        this.addPurchaseItem();
    }

    // Close purchase modal
    closePurchaseModal() {
        document.getElementById('purchaseModal').classList.add('hidden');
        document.getElementById('purchaseForm').reset();
        document.getElementById('purchaseItems').innerHTML = '';
    }

    // Add purchase item
    addPurchaseItem() {
        const itemsContainer = document.getElementById('purchaseItems');
        const itemId = Date.now();

        const itemHtml = `
            <div id="item_${itemId}" class="grid grid-cols-5 gap-2">
                <select class="product-select rounded-md border-gray-300 shadow-sm">
                    <option value="">Seleccionar producto</option>
                    <!-- Products will be loaded dynamically -->
                </select>
                <input type="number" placeholder="Cantidad" required
                       class="quantity-input rounded-md border-gray-300 shadow-sm">
                <input type="number" step="0.01" placeholder="Costo unitario" required
                       class="cost-input rounded-md border-gray-300 shadow-sm">
                <input type="text" placeholder="Almacén" required
                       class="warehouse-input rounded-md border-gray-300 shadow-sm">
                <button type="button" onclick="inventoryManager.removePurchaseItem('${itemId}')"
                        class="text-red-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        itemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        this.loadProductsForSelect(`#item_${itemId} .product-select`);
    }

    // Remove purchase item
    removePurchaseItem(itemId) {
        document.getElementById(`item_${itemId}`).remove();
    }

    // Save purchase
    savePurchase() {
        const purchase = {
            id: Date.now().toString(),
            invoiceNumber: document.getElementById('invoiceNumber').value,
            date: document.getElementById('purchaseDate').value,
            supplier: document.getElementById('supplier').value,
            items: []
        };

        // Get items
        const itemElements = document.querySelectorAll('#purchaseItems > div');
        itemElements.forEach(item => {
            purchase.items.push({
                productId: item.querySelector('.product-select').value,
                quantity: parseFloat(item.querySelector('.quantity-input').value),
                cost: parseFloat(item.querySelector('.cost-input').value),
                warehouse: item.querySelector('.warehouse-input').value
            });
        });

        // Update inventory
        this.updateInventoryFromPurchase(purchase);

        // Save purchase record
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));

        this.closePurchaseModal();
        this.showInventoryList();
    }

    // Update inventory from purchase
    updateInventoryFromPurchase(purchase) {
        const inventory = JSON.parse(localStorage.getItem(this.INVENTORY_KEY) || '[]');

        purchase.items.forEach(item => {
            const existingItem = inventory.find(i => 
                i.productId === item.productId && 
                i.warehouse === item.warehouse
            );

            if (existingItem) {
                existingItem.quantity += item.quantity;
                existingItem.lastCost = item.cost;
            } else {
                inventory.push({
                    productId: item.productId,
                    warehouse: item.warehouse,
                    quantity: item.quantity,
                    lastCost: item.cost
                });
            }
        });

        localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(inventory));
    }

    // Helper methods
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
        XLSX.writeFile(workbook, filename);
    }

    loadCategories() {
        const categories = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY) || '[]');
        const groupSelect = document.getElementById('productGroup');
        const subgroupSelect = document.getElementById('productSubgroup');

        groupSelect.innerHTML = '<option value="">Seleccionar grupo</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

        groupSelect.addEventListener('change', () => {
            const selectedGroup = categories.find(cat => cat.id === groupSelect.value);
            subgroupSelect.innerHTML = '<option value="">Seleccionar subgrupo</option>' +
                (selectedGroup?.subgroups || [])
                    .map(sub => `<option value="${sub.id}">${sub.name}</option>`)
                    .join('');
        });
    }

    loadSuppliers() {
        const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
        const supplierSelect = document.getElementById('supplier');
        supplierSelect.innerHTML = '<option value="">Seleccionar proveedor</option>' +
            suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }

    loadProductsForSelect(selector) {
        const products = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
        const select = document.querySelector(selector);
        select.innerHTML = '<option value="">Seleccionar producto</option>' +
            products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }

    filterInventory(search = '', warehouse = '') {
        const products = JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
        const inventory = JSON.parse(localStorage.getItem(this.INVENTORY_KEY) || '[]');

        const filtered = products.filter(product => {
            const matchesSearch = search === '' || 
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.code.toLowerCase().includes(search.toLowerCase());

            const matchesWarehouse = warehouse === '' ||
                inventory.some(i => i.productId === product.id && i.warehouse === warehouse);

            return matchesSearch && matchesWarehouse;
        });

        this.updateInventoryTable(filtered);
    }

    updateInventoryTable(products) {
        const inventory = JSON.parse(localStorage.getItem(this.INVENTORY_KEY) || '[]');
        const tbody = document.querySelector('#inventoryContent table tbody');

        tbody.innerHTML = products.map(product => {
            const stock = inventory.find(i => i.productId === product.id)?.quantity || 0;
            const utility = ((product.price - product.cost) / product.cost * 100).toFixed(2);
            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">${product.code}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${product.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${stock}</td>
                    <td class="px-6 py-4 whitespace-nowrap">$${product.cost}</td>
                    <td class="px-6 py-4 whitespace-nowrap">$${product.price}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${utility}%</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button onclick="inventoryManager.editProduct('${product.id}')"
                                class="text-blue-600 hover:text-blue-900">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="inventoryManager.deleteProduct('${product.id}')"
                                class="ml-2 text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Initialize inventory manager
const inventoryManager = new InventoryManager();

// Load inventory module
function loadInventoryModule() {
    inventoryManager.init();
}
