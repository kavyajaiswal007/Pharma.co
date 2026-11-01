# 💊✨ pharma.Co — Smart Apothecary & Wellness OS

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21+-orange.svg?logo=openjdk)](https://openjdk.org/)
[![Database](https://img.shields.io/badge/Database-H2_Embedded-blue.svg)](https://www.h2database.com)
[![UI](https://img.shields.io/badge/UI-Tailwind_CSS_+_Web_Audio-teal.svg)](https://tailwindcss.com)

> **"Your Friendly Neighbourhood Wellness Apothecary & Next-Gen Dispenser OS"**

**pharma.Co** is a playful, high-performance, full-stack pharmacy management system re-architected entirely in **Spring Boot 3**, featuring an embedded zero-configuration database, an interactive POS terminal, a built-in AI Clinical Lab, loyalty perk tracking, and custom sound effects!

---

## 🚀 Key Features

### ⚡ Express POS & Smart Billing Terminal
- **Fast Formulation Search**: Select medicine with real-time stock on hand and unit price inspection.
- **Cart Manifest**: Add pills with live line totals, stock boundary prevention, and item removal.
- **🎟️ Magic Promo Vault**: Apply instant promo codes at checkout:
  - `MAGICPILL` ➔ 15% Magic Discount ✨
  - `STUDENTREVIVE` ➔ 10% Cramming Exam Relief 📚
  - `HAPPYPILL` ➔ Flat Rs. 100 Happiness Credit 🌟
  - `IMMUNITYBOOST` ➔ 20% Immune Supercharger 🛡️
- **Instant Change Calculation**: Dynamic balance calculation with warning alerts on underpayment.
- **Celebratory Confetti & Sound FX**: Web Audio synthesizer triggers playful pops, cash register dings (*ka-ching!*), and celebratory confetti bursts on completed orders!
- **Cute Thermal Receipt**: Print or download authentic pharmacy invoices complete with itemized tables, totals, discounts, and personalized health tips!

---

### 🤖 Dr. PillBot — AI Pharmacist Lab
- Interactive clinical heuristic assistant embedded directly into the OS.
- Quick consultation chips for **Headache Protocol**, **Vitamin Stacking**, **Antibiotic Stewardship**, **Deep Sleep Optimization**, and **Clean Energy Boosts**.
- Instant clinical advice with personalized safety warnings and mood emojis!

---

### 📊 Real-Time Analytics & Radar Dashboard
- **Live KPI Counters**: Total Medicines, Active Loyalty Clients, Today's Sales, and Cumulative Gross Revenue.
- **Sales Velocity Curve**: Dynamic Area Chart powered by Chart.js displaying daily revenue trajectories.
- **Expiring Soon Radar**: Automatic alerts for medicines approaching expiration within the next 60 days.
- **Low Stock Inventory Monitor**: Highlights shelves running low (< 30 units) with direct restock shortcuts.
- **Apothecary Trivia of the Day**: Rotating daily medical history and pharmacology fun facts.

---

### 📦 Inflow Restock Dock
- Log supplier incoming shipments with Supplier Name, Restocked Pill, Inflow Quantity, and Unit Cost.
- **Automatic Inventory Refill**: Committing a supply record immediately replenishes the live medicine stock in the catalog!

---

### 👥 Customer Registry & Loyalty Tiers
- Manage clients with phone, delivery address, and tiered loyalty memberships (**Gold VIP**, **Silver**, **Bronze**).

---

### 🚚 Supplier Allies
- Manage pharmaceutical distribution networks and partner reliability scores (e.g. `5.0 ★`).

---

### 🌓 Cyber Dark Mode & Sound Toggle
- Seamless one-click switch between **Clean Apothecary Light Mode** and **Cyber Neon Dark Mode**.
- Toggleable Web Audio FX synthesizer for quiet environments.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Spring Boot 3.3.5 (Java 21) |
| **Data Persistence** | Spring Data JPA / Hibernate |
| **Database** | Embedded H2 Engine (File-persisted in `./data/pharmaco` — zero setup required!) |
| **Frontend UI** | HTML5, Tailwind CSS, Lucide Icons |
| **Interactive Libraries** | Chart.js, Canvas Confetti, Web Audio API Synthesizer |
| **Build System** | Apache Maven |

---

## 🏃 Quick Start Guide

### 1. Prerequisites
- **Java 21** or higher
- **Maven** (or use the included `./mvnw` wrapper)

### 2. Run the Application
In the project root directory, run:

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or with system Maven
mvn spring-boot:run
```

The application will automatically:
1. Boot the Spring Boot server on port `8080`.
2. Initialize the file-backed H2 database engine in `./data/`.
3. Auto-seed sample catalog medicines, loyalty customers, allied suppliers, and historical sales orders!

### 3. Open in Browser
Visit:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 🔑 Default Credentials

| Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` (or `admin@pharmaco.com`) | `123` | Full Access (POS, Catalog, Staff, Inflow, Analytics) |
| **Apothecary Staff** | `isuru` (or `isuru@pharmaco.com`) | `456` | POS Sales, Customers, Medicines, Supplies |

---

## 📁 Package Structure

```text
src/main/java/co/pharma/
├── PharmaCoApplication.java       # Main Spring Boot Runner
├── config/
│   └── DataInitializer.java       # Automatic DB Seeder
├── controller/
│   ├── AuthController.java        # Login & Password Reset
│   ├── MedicineController.java    # Pill Catalog APIs
│   ├── CustomerController.java    # Loyalty Member APIs
│   ├── SupplierController.java    # Allied Partner APIs
│   ├── SupplyController.java      # Inflow Restock APIs
│   ├── OrderController.java       # POS Billing & Invoicing APIs
│   ├── DashboardController.java   # Analytics & Trend APIs
│   ├── AiPharmacistController.java# Dr. PillBot Heuristics
│   └── UserController.java        # Staff & Privileges APIs
├── dto/                           # Request / Response Payloads
├── model/                         # JPA Entities (Medicine, Customer, Order, etc.)
├── repository/                    # Spring Data JPA Repositories
└── service/                       # Core Business & Calculation Services
```

---

## 📜 H2 Web Console (Optional)
If you want to inspect database tables directly in your browser:
- **URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:file:./data/pharmaco`
- **Username**: `sa`
- **Password**: *(leave blank)*

---

## 💖 Developed with Love for pharma.Co
Enjoy managing your smart apothecary! 💊✨
