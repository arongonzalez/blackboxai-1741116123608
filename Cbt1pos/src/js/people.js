// People Management System (Customers, Users, Suppliers)
class PeopleManager {
    constructor() {
        this.CUSTOMERS_KEY = 'cbt1pos_customers';
        this.SUPPLIERS_KEY = 'cbt1pos_suppliers';
        this.currentSection = 'customers';
        this.editingId = null;
    }

    // Initialize people module
    async init() {
        await this.loadPeopleInterface();
    }

    // Show/hide modals
    showCustomerModal() {
        document.getElementById('customerModal').classList.remove('hidden');
    }

    closeCustomerModal() {
        document.getElementById('customerModal').classList.add('hidden');
        document.getElementById('customerForm').reset();
        this.editingId = null;
    }

    showUserModal() {
        document.getElementById('userModal').classList.remove('hidden');
    }

    closeUserModal() {
        document.getElementById('userModal').classList.add('hidden');
        document.getElementById('userForm').reset();
        this.editingId = null;
    }

    showSupplierModal() {
        document.getElementById('supplierModal').classList.remove('hidden');
    }

    closeSupplierModal() {
        document.getElementById('supplierModal').classList.add('hidden');
        document.getElementById('supplierForm').reset();
        this.editingId = null;
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

    // Save methods
    saveCustomer() {
        const formData = new FormData(document.getElementById('customerForm'));
        
        const customer = {
            id: this.editingId || Date.now().toString(),
            name: formData.get('customerName'),
            rif: formData.get('customerRif'),
            phone: formData.get('customerPhone'),
            email: formData.get('customerEmail'),
            address: formData.get('customerAddress'),
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        const customers = JSON.parse(localStorage.getItem(this.CUSTOMERS_KEY) || '[]');
        
        if (this.editingId) {
            const index = customers.findIndex(c => c.id === this.editingId);
            if (index !== -1) {
                customers[index] = { ...customers[index], ...customer };
            }
        } else {
            customers.push(customer);
        }

        localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
        this.closeCustomerModal();
        this.showCustomers();
    }

    saveUser() {
        const formData = new FormData(document.getElementById('userForm'));
        
        const user = {
            id: this.editingId || Date.now().toString(),
            username: formData.get('username'),
            password: formData.get('password'), // In production, this should be hashed
            fullName: formData.get('fullName'),
            role: formData.get('userRole'),
            email: formData.get('userEmail'),
            status: formData.get('userStatus'),
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (this.editingId) {
            const index = users.findIndex(u => u.id === this.editingId);
            if (index !== -1) {
                users[index] = { ...users[index], ...user };
            }
        } else {
            // Check if username already exists
            if (users.some(u => u.username === user.username)) {
                alert('El nombre de usuario ya existe');
                return;
            }
            users.push(user);
        }

        localStorage.setItem('users', JSON.stringify(users));
        this.closeUserModal();
        this.showUsers();
    }

    saveSupplier() {
        const formData = new FormData(document.getElementById('supplierForm'));
        
        const supplier = {
            id: this.editingId || Date.now().toString(),
            name: formData.get('supplierName'),
            rif: formData.get('supplierRif'),
            phone: formData.get('supplierPhone'),
            email: formData.get('supplierEmail'),
            address: formData.get('supplierAddress'),
            contact: formData.get('supplierContact'),
            status: formData.get('supplierStatus'),
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        const suppliers = JSON.parse(localStorage.getItem(this.SUPPLIERS_KEY) || '[]');
        
        if (this.editingId) {
            const index = suppliers.findIndex(s => s.id === this.editingId);
            if (index !== -1) {
                suppliers[index] = { ...suppliers[index], ...supplier };
            }
        } else {
            suppliers.push(supplier);
        }

        localStorage.setItem(this.SUPPLIERS_KEY, JSON.stringify(suppliers));
        this.closeSupplierModal();
        this.showSuppliers();
    }

    // Delete methods
    deleteCustomer(id) {
        if (!confirm('¿Está seguro de eliminar este cliente?')) return;

        const customers = JSON.parse(localStorage.getItem(this.CUSTOMERS_KEY) || '[]');
        const filtered = customers.filter(c => c.id !== id);
        localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(filtered));
        this.showCustomers();
    }

    deleteUser(id) {
        if (!confirm('¿Está seguro de eliminar este usuario?')) return;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(filtered));
        this.showUsers();
    }

    deleteSupplier(id) {
        if (!confirm('¿Está seguro de eliminar este proveedor?')) return;

        const suppliers = JSON.parse(localStorage.getItem(this.SUPPLIERS_KEY) || '[]');
        const filtered = suppliers.filter(s => s.id !== id);
        localStorage.setItem(this.SUPPLIERS_KEY, JSON.stringify(filtered));
        this.showSuppliers();
    }

    // Edit methods
    editCustomer(id) {
        const customers = JSON.parse(localStorage.getItem(this.CUSTOMERS_KEY) || '[]');
        const customer = customers.find(c => c.id === id);
        if (!customer) return;

        this.editingId = id;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerRif').value = customer.rif;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerAddress').value = customer.address;

        this.showCustomerModal();
    }

    editUser(id) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === id);
        if (!user) return;

        this.editingId = id;
        document.getElementById('username').value = user.username;
        document.getElementById('fullName').value = user.fullName;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userStatus').value = user.status;
        // Don't fill password field for security

        this.showUserModal();
    }

    editSupplier(id) {
        const suppliers = JSON.parse(localStorage.getItem(this.SUPPLIERS_KEY) || '[]');
        const supplier = suppliers.find(s => s.id === id);
        if (!supplier) return;

        this.editingId = id;
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierRif').value = supplier.rif;
        document.getElementById('supplierPhone').value = supplier.phone;
        document.getElementById('supplierEmail').value = supplier.email;
        document.getElementById('supplierAddress').value = supplier.address;
        document.getElementById('supplierContact').value = supplier.contact;
        document.getElementById('supplierStatus').value = supplier.status;

        this.showSupplierModal();
    }

    // Filter methods
    filterCustomers(search) {
        const customers = JSON.parse(localStorage.getItem(this.CUSTOMERS_KEY) || '[]');
        const filtered = customers.filter(customer => 
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.rif.toLowerCase().includes(search.toLowerCase()) ||
            customer.phone.toLowerCase().includes(search.toLowerCase())
        );
        this.updateCustomersTable(filtered);
    }

    filterUsers(search) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.fullName.toLowerCase().includes(search.toLowerCase())
        );
        this.updateUsersTable(filtered);
    }

    filterSuppliers(search) {
        const suppliers = JSON.parse(localStorage.getItem(this.SUPPLIERS_KEY) || '[]');
        const filtered = suppliers.filter(supplier => 
            supplier.name.toLowerCase().includes(search.toLowerCase()) ||
            supplier.rif.toLowerCase().includes(search.toLowerCase()) ||
            supplier.contact.toLowerCase().includes(search.toLowerCase())
        );
        this.updateSuppliersTable(filtered);
    }

    // Update table methods
    updateCustomersTable(customers) {
        const tbody = document.querySelector('#peopleContent table tbody');
        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${customer.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">${customer.rif}</td>
                <td class="px-6 py-4 whitespace-nowrap">${customer.phone}</td>
                <td class="px-6 py-4 whitespace-nowrap">${customer.email || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onclick="peopleManager.editCustomer('${customer.id}')"
                            class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="peopleManager.deleteCustomer('${customer.id}')"
                            class="ml-2 text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateUsersTable(users) {
        const tbody = document.querySelector('#peopleContent table tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap">${user.fullName}</td>
                <td class="px-6 py-4 whitespace-nowrap">${this.getRoleName(user.role)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onclick="peopleManager.editUser('${user.id}')"
                            class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="peopleManager.deleteUser('${user.id}')"
                            class="ml-2 text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateSuppliersTable(suppliers) {
        const tbody = document.querySelector('#peopleContent table tbody');
        tbody.innerHTML = suppliers.map(supplier => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${supplier.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">${supplier.rif}</td>
                <td class="px-6 py-4 whitespace-nowrap">${supplier.contact}</td>
                <td class="px-6 py-4 whitespace-nowrap">${supplier.phone}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${supplier.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onclick="peopleManager.editSupplier('${supplier.id}')"
                            class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="peopleManager.deleteSupplier('${supplier.id}')"
                            class="ml-2 text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Initialize people manager
const peopleManager = new PeopleManager();

// Load people module
function loadPeopleModule() {
    peopleManager.init();
}
