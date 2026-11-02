// ==========================================================================
// pharma.Co — API Service (Connecting to Spring Boot Backend)
// ==========================================================================

const API_BASE = '/api';

export const api = {
    // Authentication
    login: async (username, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },

    forgotPassword: async (email, newPassword) => {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        return res.text();
    },

    // Dashboard
    getDashboardStats: async () => {
        const res = await fetch(`${API_BASE}/dashboard`);
        return res.json();
    },

    // Medicines
    getMedicines: async (search = '') => {
        const url = search ? `${API_BASE}/medicines?search=${encodeURIComponent(search)}` : `${API_BASE}/medicines`;
        const res = await fetch(url);
        return res.json();
    },

    saveMedicine: async (data) => {
        const res = await fetch(`${API_BASE}/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    updateMedicine: async (id, data) => {
        const res = await fetch(`${API_BASE}/medicines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    deleteMedicine: async (id) => {
        const res = await fetch(`${API_BASE}/medicines/${id}`, { method: 'DELETE' });
        return res.ok;
    },

    // Customers
    getCustomers: async (search = '') => {
        const url = search ? `${API_BASE}/customers?search=${encodeURIComponent(search)}` : `${API_BASE}/customers`;
        const res = await fetch(url);
        return res.json();
    },

    saveCustomer: async (data) => {
        const res = await fetch(`${API_BASE}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    updateCustomer: async (id, data) => {
        const res = await fetch(`${API_BASE}/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    deleteCustomer: async (id) => {
        const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
        return res.ok;
    },

    // Suppliers
    getSuppliers: async (search = '') => {
        const url = search ? `${API_BASE}/suppliers?search=${encodeURIComponent(search)}` : `${API_BASE}/suppliers`;
        const res = await fetch(url);
        return res.json();
    },

    saveSupplier: async (data) => {
        const res = await fetch(`${API_BASE}/suppliers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    updateSupplier: async (id, data) => {
        const res = await fetch(`${API_BASE}/suppliers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    deleteSupplier: async (id) => {
        const res = await fetch(`${API_BASE}/suppliers/${id}`, { method: 'DELETE' });
        return res.ok;
    },

    // Supply Inflow
    getSupplies: async () => {
        const res = await fetch(`${API_BASE}/supplies`);
        return res.json();
    },

    saveSupply: async (data) => {
        const res = await fetch(`${API_BASE}/supplies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    deleteSupply: async (id) => {
        const res = await fetch(`${API_BASE}/supplies/${id}`, { method: 'DELETE' });
        return res.ok;
    },

    // Orders
    placeOrder: async (data) => {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // AI Pharmacist
    consultAi: async (query) => {
        const res = await fetch(`${API_BASE}/ai/consult?query=${encodeURIComponent(query)}`);
        return res.json();
    },

    // Users
    getUsers: async () => {
        const res = await fetch(`${API_BASE}/users`);
        return res.json();
    },

    saveUser: async (data) => {
        const res = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    updateUser: async (id, data) => {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.ok;
    },

    deleteUser: async (id) => {
        const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
        return res.ok;
    }
};
