// Point of Sale (POS) System
class POSManager {
    constructor() {
        this.currentSale = {
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0,
            customer: null,
            paymentMethod: null,
            exchangeRate: 0
        };
        this.SALES_KEY = 'cbt1pos_sales';
        this.exchangeRate = parseFloat(localStorage.getItem('exchangeRate')) || 0;
    }

    // Initialize POS module
    async init() {
        this.updateExchangeRate();
        await this.loadPOSInterface();
    }

    // Load POS interface
    async loadPOSInterface() {
        const moduleContent = document.getElementById('moduleContent');
        moduleContent.innerHTML = `
            <div class="grid grid-cols-12 gap-4 h-full">
                <!-- Products Section -->
                <div class="col-span-8 bg-white rounded-lg shadow p-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex-1 mr-4">
                            <input type="text" id="searchProduct" 
                                   class="w-full px-4 py-2 border rounded-lg" 
                                   placeholder="Buscar producto...">
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="posManager.showCategories()" 
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Categorías
                            </button>
                            <button onclick="posManager.scanBarcode()" 
                                    class="px-4 py-2 bg-green-500 text-white rounded-lg">
                                <i class="fas fa-barcode"></i>
                            </button>
                        </div>
                    </div>
                    <div id="productsGrid" class="grid grid-cols-4 gap-4 overflow-y-auto" style="height: calc(100vh - 250px);">
                        <!-- Products will be loaded here -->
                    </div>
                </div>

                <!-- Cart Section -->
                <div class="col-span-4 bg-white rounded-lg shadow">
                    <div class="p-4 border-b">
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="text-lg font-semibold">Carrito de Compras</h3>
                            <button onclick="posManager.clearCart()" 
                                    class="text-red-500 hover:text-red-700">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="text-sm text-gray-600">
                            Tasa del día: <span id="currentRate">${this.exchangeRate}</span> Bs.
                        </div>
                    </div>
                    <div id="cartItems" class="overflow-y-auto p-4" style="height: calc(100vh - 450px);">
                        <!-- Cart items will be loaded here -->
                    </div>
                    <div class="border-t p-4">
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span>Subtotal:</span>
                                <span id="subtotal">$0.00</span>
                            </div>
                            <div class="flex justify-between">
                                <span>IVA (16%):</span>
                                <span id="tax">$0.00</span>
                            </div>
                            <div class="flex justify-between font-bold">
                                <span>Total:</span>
                                <span id="total">$0.00</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Total en Bs.:</span>
                                <span id="totalBs">Bs. 0,00</span>
                            </div>
                        </div>
                        <div class="mt-4 space-y-2">
                            <button onclick="posManager.showCustomerModal()" 
                                    class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
                                <i class="fas fa-user"></i> Cliente
                            </button>
                            <button onclick="posManager.showPaymentModal()" 
                                    class="w-full px-4 py-2 bg-green-500 text-white rounded-lg">
                                <i class="fas fa-money-bill"></i> Procesar Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Modal -->
            <div id="customerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden">
                <div class="bg-white rounded-lg w-96 mx-auto mt-20 p-4">
                    <h3 class="text-lg font-semibold mb-4">Datos del Cliente</h3>
                    <div class="space-y-4">
                        <input type="text" id="customerName" placeholder="Nombre y Apellido" 
                               class="w-full px-4 py-2 border rounded-lg">
                        <input type="text" id="customerRif" placeholder="CI/RIF" 
                               class="w-full px-4 py-2 border rounded-lg">
                        <input type="tel" id="customerPhone" placeholder="Teléfono" 
                               class="w-full px-4 py-2 border rounded-lg">
                        <input type="text" id="customerAddress" placeholder="Dirección" 
                               class="w-full px-4 py-2 border rounded-lg">
                        <div class="flex justify-end space-x-2">
                            <button onclick="posManager.closeCustomerModal()" 
                                    class="px-4 py-2 border rounded-lg">
                                Cancelar
                            </button>
                            <button onclick="posManager.saveCustomer()" 
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Modal -->
            <div id="paymentModal" class="fixed inset-0 bg-black bg-opacity-50 hidden">
                <div class="bg-white rounded-lg w-96 mx-auto mt-20 p-4">
                    <h3 class="text-lg font-semibold mb-4">Procesar Pago</h3>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="posManager.selectPayment('cash_bs')" 
                                    class="p-4 border rounded-lg text-center">
                                <i class="fas fa-money-bill"></i><br>Efectivo Bs.
                            </button>
                            <button onclick="posManager.selectPayment('cash_usd')" 
                                    class="p-4 border rounded-lg text-center">
                                <i class="fas fa-dollar-sign"></i><br>Efectivo USD
                            </button>
                            <button onclick="posManager.selectPayment('debit')" 
                                    class="p-4 border rounded-lg text-center">
                                <i class="fas fa-credit-card"></i><br>Débito
                            </button>
                            <button onclick="posManager.selectPayment('biopago')" 
                                    class="p-4 border rounded-lg text-center">
                                <i class="fas fa-mobile-alt"></i><br>Biopago
                            </button>
                        </div>
                        <div id="paymentDetails" class="hidden space-y-2">
                            <div class="flex justify-between">
                                <span>Monto a pagar:</span>
                                <span id="paymentAmount">$0.00</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Monto recibido:</span>
                                <input type="number" id="receivedAmount" 
                                       class="w-32 px-2 py-1 border rounded-lg text-right">
                            </div>
                            <div class="flex justify-between">
                                <span>Cambio:</span>
                                <span id="changeAmount">$0.00</span>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button onclick="posManager.closePaymentModal()" 
                                    class="px-4 py-2 border rounded-lg">
                                Cancelar
                            </button>
                            <button onclick="posManager.processSale()" 
                                    class="px-4 py-2 bg-green-500 text-white rounded-lg">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const searchInput = document.getElementById('searchProduct');
        searchInput.addEventListener('input', (e) => this.searchProducts(e.target.value));

        // Load initial products
        await this.loadProducts();
    }

    // Load products
    async loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const products = JSON.parse(localStorage.getItem('products') || '[]');

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" onclick="posManager.addToCart('${product.id}')">
                <img src="${product.image || 'assets/no-image.png'}" 
                     alt="${product.name}" 
                     class="w-full h-32 object-cover rounded-t-lg">
                <div class="p-2">
                    <h4 class="font-semibold truncate">${product.name}</h4>
                    <p class="text-sm text-gray-600">$${product.price}</p>
                </div>
            </div>
        `).join('');
    }

    // Add item to cart
    addToCart(productId) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (!product) return;

        const existingItem = this.currentSale.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.currentSale.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                tax: product.tax || 0
            });
        }

        this.updateCart();
    }

    // Update cart display
    updateCart() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = this.currentSale.items.map(item => `
            <div class="flex justify-between items-center mb-2 p-2 border rounded">
                <div>
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-sm text-gray-600">$${item.price} x ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="posManager.updateQuantity('${item.id}', ${item.quantity - 1})"
                            class="px-2 py-1 border rounded">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="posManager.updateQuantity('${item.id}', ${item.quantity + 1})"
                            class="px-2 py-1 border rounded">+</button>
                </div>
            </div>
        `).join('');

        this.updateTotals();
    }

    // Update quantity of item in cart
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.currentSale.items = this.currentSale.items.filter(item => item.id !== productId);
        } else {
            const item = this.currentSale.items.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
            }
        }

        this.updateCart();
    }

    // Update totals
    updateTotals() {
        this.currentSale.subtotal = this.currentSale.items.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );
        
        this.currentSale.tax = this.currentSale.items.reduce(
            (sum, item) => sum + (item.price * item.quantity * (item.tax / 100)), 0
        );
        
        this.currentSale.total = this.currentSale.subtotal + this.currentSale.tax;

        document.getElementById('subtotal').textContent = `$${this.currentSale.subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${this.currentSale.tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${this.currentSale.total.toFixed(2)}`;
        document.getElementById('totalBs').textContent = 
            `Bs. ${(this.currentSale.total * this.exchangeRate).toFixed(2)}`;
    }

    // Show customer modal
    showCustomerModal() {
        document.getElementById('customerModal').classList.remove('hidden');
    }

    // Close customer modal
    closeCustomerModal() {
        document.getElementById('customerModal').classList.add('hidden');
    }

    // Save customer
    saveCustomer() {
        this.currentSale.customer = {
            name: document.getElementById('customerName').value,
            rif: document.getElementById('customerRif').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value
        };
        this.closeCustomerModal();
    }

    // Show payment modal
    showPaymentModal() {
        if (this.currentSale.items.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        document.getElementById('paymentModal').classList.remove('hidden');
        document.getElementById('paymentAmount').textContent = 
            `$${this.currentSale.total.toFixed(2)}`;
    }

    // Close payment modal
    closePaymentModal() {
        document.getElementById('paymentModal').classList.add('hidden');
        document.getElementById('paymentDetails').classList.add('hidden');
    }

    // Select payment method
    selectPayment(method) {
        this.currentSale.paymentMethod = method;
        document.getElementById('paymentDetails').classList.remove('hidden');
        
        const receivedInput = document.getElementById('receivedAmount');
        receivedInput.value = '';
        receivedInput.addEventListener('input', () => this.calculateChange());
    }

    // Calculate change
    calculateChange() {
        const received = parseFloat(document.getElementById('receivedAmount').value) || 0;
        const change = received - this.currentSale.total;
        
        document.getElementById('changeAmount').textContent = 
            change >= 0 ? `$${change.toFixed(2)}` : '$0.00';
    }

    // Process sale
    async processSale() {
        if (!this.currentSale.paymentMethod) {
            alert('Seleccione un método de pago');
            return;
        }

        const received = parseFloat(document.getElementById('receivedAmount').value) || 0;
        if (received < this.currentSale.total) {
            alert('El monto recibido es insuficiente');
            return;
        }

        // Save sale
        const sale = {
            ...this.currentSale,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            exchangeRate: this.exchangeRate,
            change: received - this.currentSale.total
        };

        const sales = JSON.parse(localStorage.getItem(this.SALES_KEY) || '[]');
        sales.push(sale);
        localStorage.setItem(this.SALES_KEY, JSON.stringify(sales));

        // Print receipt
        await this.printReceipt(sale);

        // Clear cart
        this.clearCart();
        this.closePaymentModal();
    }

    // Print receipt
    async printReceipt(sale) {
        const receiptTemplate = `
            <div class="text-center">
                <h2 class="text-xl font-bold">CBT1POS</h2>
                <p class="text-sm">Comprobante de Venta</p>
                <p class="text-sm">Fecha: ${new Date(sale.date).toLocaleString()}</p>
                ${sale.customer ? `
                    <div class="text-left mt-4">
                        <p>Cliente: ${sale.customer.name}</p>
                        <p>RIF/CI: ${sale.customer.rif}</p>
                        <p>Teléfono: ${sale.customer.phone}</p>
                        <p>Dirección: ${sale.customer.address}</p>
                    </div>
                ` : ''}
                <div class="divider"></div>
                <table class="w-full text-left">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sale.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price}</td>
                                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="divider"></div>
                <div class="text-right">
                    <p>Subtotal: $${sale.subtotal.toFixed(2)}</p>
                    <p>IVA: $${sale.tax.toFixed(2)}</p>
                    <p class="font-bold">Total: $${sale.total.toFixed(2)}</p>
                    <p>Total en Bs.: ${(sale.total * sale.exchangeRate).toFixed(2)}</p>
                    <p>Método de pago: ${this.getPaymentMethodName(sale.paymentMethod)}</p>
                    ${sale.change > 0 ? `<p>Cambio: $${sale.change.toFixed(2)}</p>` : ''}
                </div>
                <div class="divider"></div>
                <p class="text-sm">¡Gracias por su compra!</p>
            </div>
        `;

        printTicket(receiptTemplate);
    }

    // Get payment method name
    getPaymentMethodName(method) {
        const methods = {
            cash_bs: 'Efectivo Bs.',
            cash_usd: 'Efectivo USD',
            debit: 'Tarjeta de Débito',
            biopago: 'Biopago'
        };
        return methods[method] || method;
    }

    // Clear cart
    clearCart() {
        this.currentSale = {
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0,
            customer: null,
            paymentMethod: null
        };
        this.updateCart();
    }

    // Update exchange rate
    updateExchangeRate() {
        this.exchangeRate = parseFloat(localStorage.getItem('exchangeRate')) || 0;
        document.getElementById('currentRate').textContent = this.exchangeRate.toFixed(2);
    }

    // Search products
    searchProducts(query) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.code.toLowerCase().includes(query.toLowerCase())
        );

        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = filtered.map(product => `
            <div class="product-card" onclick="posManager.addToCart('${product.id}')">
                <img src="${product.image || 'assets/no-image.png'}" 
                     alt="${product.name}" 
                     class="w-full h-32 object-cover rounded-t-lg">
                <div class="p-2">
                    <h4 class="font-semibold truncate">${product.name}</h4>
                    <p class="text-sm text-gray-600">$${product.price}</p>
                </div>
            </div>
        `).join('');
    }

    // Scan barcode
    scanBarcode() {
        const code = prompt('Ingrese el código de barras:');
        if (code) {
            this.searchProducts(code);
        }
    }
}

// Initialize POS manager
const posManager = new POSManager();

// Load POS module
function loadPOSModule() {
    posManager.init();
}
