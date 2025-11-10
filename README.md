# 🏠 Real Estate App  

A **capstone project** built during internship training — this web-based real estate management system allows customers to explore, buy, or rent properties, while brokers can list and manage them efficiently.  

It provides a responsive and modern platform for real estate operations with secure authentication, property search, and deal management.  

---

## ✨ Features  

### 👤 Customer Portal  
- Browse and search properties by city, price, and configuration  
- View property details with images and broker information  
- Create buy/rent deals directly  
- Track owned or rented properties  

### 🧑‍💼 Broker Portal  
- Add, edit, and delete property listings  
- Upload and manage property images  
- View customer deals and property status  
- Update listing availability (sold/rented)  

### 🔐 Authentication & Roles  
- Secure login using Spring Security (Basic Auth)  
- Role-based access control (`BROKER` / `CUSTOMER`)  
- Session persistence via React Context  

### 🏡 Property Management  
- Advanced property filtering (by offer, cost, type)  
- Dynamic deal creation and property status updates  
- Image previews and future rating/comment features  

---

## 🛠️ Tech Stack  

- **Frontend:** React 18 (Vite + TypeScript), Tailwind CSS, Material UI, React Router, React Query  
- **Backend:** Spring Boot 3.2, Spring Data JPA, Spring Security, Java Mail  
- **Database:** H2 (Dev) 
- **Authentication:** Basic Auth with role-based access  
- **Build Tools:** Maven, Vite  

---

## ⚡ Getting Started  

### Prerequisites  
- [Java 17+](https://adoptium.net/)  
- [Maven 3.8+](https://maven.apache.org/download.cgi)  
- [Node.js 20.19+](https://nodejs.org/en/download)  

---

### 🧩 Backend Setup  

1. **Clone repo**  
   ```bash
   git clone https://github.com/wabi-sabi-ux/RealEstate-App.git
   cd RealEstate-App
   ```

2. **Run Spring Boot server**  
   ```bash
   mvn spring-boot:run
   ```

3. **Access API & H2 Console**
   - API Base: [http://localhost:8080](http://localhost:8080)  
   - H2 Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

### 🎨 Frontend Setup  

1. **Navigate to frontend**  
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Access frontend**  
   [http://localhost:5173](http://localhost:5173)

3. **Environment Configuration**  
   Create a `.env` file inside `frontend/`:
   ```bash
   VITE_API_BASE=http://localhost:8080
   ```

---

## 👤 Default Users  

| Role      | Email             | Password |
|-----------|-------------------|----------|
| Broker    | broker@gmail.com  | 1111     |
| Customer  | cust@gmail.com    | 2222     |

---

## 📁 Project Structure  

```bash
real-estate-app/
 ├── backend/
 │   ├── src/main/java/com/realestate/...     # Spring Boot backend
 │   ├── src/main/resources/application.yml   # Configuration
 │   └── uploads/                             # Property images (ignored by git)
 │
 ├── frontend/
 │   ├── src/
 │   │   ├── components/                      # Navbar, PropertyCard, SearchBar
 │   │   ├── context/                         # AuthContext (login/session)
 │   │   ├── lib/                             # API modules (axios, propertyApi)
 │   │   ├── pages/                           # Home, Login, PropertyDetails
 │   │   └── main.tsx
 │   ├── public/logo.svg                      # App icon
 │   ├── package.json
 │   └── vite.config.ts
 │
 └── README.md
```

---

## 🔗 Core API Endpoints  

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/users/login` | Authenticate user (Broker/Customer) |
| `GET` | `/api/properties` | Retrieve all properties |
| `GET` | `/api/properties/search` | Search by city, type, or price range |
| `GET` | `/api/properties/{id}` | Get property details |
| `POST` | `/api/deals` | Create a buy/rent deal |
| `GET` | `/api/brokers` | List all brokers |
| `POST` | `/api/brokers/{id}/ratings` | Add rating/comment for broker |

---

## 🚀 Future Enhancements  

-  Image Upload with drag-and-drop for brokers  
-  Favorites & Property Comparison  
-  Customer Reviews for Properties & Brokers  
-  Payment Integration (Razorpay/Stripe)  
-  Broker Analytics Dashboard  
-  Map View using Leaflet or Google Maps  
-  Email/Toast Notifications for deals  

---

## 🧾 License  
Licensed under the **MIT License** — free to use and modify.  

---
