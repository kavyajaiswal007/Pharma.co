# 💊 pharma.Co — Clinical Apothecary & Inventory OS

A clean, modern pharmacy management system with a Dark Liquid Glass design language, Spring Boot 3 backend with embedded H2 persistence, and a decoupled, flat frontend architecture.

---

## 📁 Flat & Simple Folder Structure

The project strictly follows a flat, 2-level folder structure with zero unnecessary nesting, DTO, or utility folders:

```
Pharmacy-management-system-main/
│
├── frontend/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ReceiptModal.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── AiPharmacist.jsx
│   │   ├── Customers.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LoginModal.jsx
│   │   ├── Medicines.jsx
│   │   ├── OrderTerminal.jsx
│   │   ├── Suppliers.jsx
│   │   ├── SupplyRestock.jsx
│   │   └── Users.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── style.css
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── src/main/java/co/pharma/
│   │   ├── controller/
│   │   │   ├── AiPharmacistController.java
│   │   │   ├── AuthController.java
│   │   │   ├── CustomerController.java
│   │   │   ├── DashboardController.java
│   │   │   ├── MedicineController.java
│   │   │   ├── OrderController.java
│   │   │   ├── SupplierController.java
│   │   │   ├── SupplyController.java
│   │   │   ├── UserController.java
│   │   │   └── WebController.java
│   │   ├── service/
│   │   │   ├── AiPharmacistService.java
│   │   │   ├── CustomerService.java
│   │   │   ├── DashboardService.java
│   │   │   ├── DataInitializer.java
│   │   │   ├── MedicineService.java
│   │   │   ├── OrderService.java
│   │   │   ├── SupplierService.java
│   │   │   ├── SupplyService.java
│   │   │   └── UserService.java
│   │   ├── repository/
│   │   │   ├── CustomerRepository.java
│   │   │   ├── MedicineRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   ├── PaymentRepository.java
│   │   │   ├── SupplierRepository.java
│   │   │   ├── SupplyRecordRepository.java
│   │   │   └── UserRepository.java
│   │   ├── entity/
│   │   │   ├── Customer.java
│   │   │   ├── Medicine.java
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   ├── Payment.java
│   │   │   ├── Supplier.java
│   │   │   ├── SupplyRecord.java
│   │   │   ├── User.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── OrderRequest.java
│   │   │   ├── CartItemRequest.java
│   │   │   ├── SupplyRequest.java
│   │   │   ├── DashboardStats.java
│   │   │   └── AiTipResponse.java
│   │   └── PharmaCoApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/
│   └── pom.xml
│
├── data/
│   ├── pharmaco.mv.db
│   └── pharmaco.trace.db
│
├── pom.xml
└── README.md
```

---

## ⚡ Quick Start

### 1. Launch the Backend Server
From either the root directory or inside `backend/`:

```bash
cd backend
./mvnw spring-boot:run
```

The Spring Boot backend will start on:
**http://localhost:8085**

### 2. Demo Credentials
- **Admin**: `admin` / `123`
- **Staff**: `isuru` / `456`

---

## 🛠️ Technology Stack
- **Backend**: Java 21, Spring Boot 3.3.5, Spring Data JPA, H2 Database (File persistent)
- **Frontend**: Dark Liquid Glass CSS, React 18 / Vanilla JavaScript, Tailwind CSS, Lucide Icons, Chart.js
