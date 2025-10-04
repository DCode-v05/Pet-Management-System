# Pet Management System

## Project Description
The Pet Management System is a web-based application designed to help users efficiently manage pet records. It is suitable for pet owners, veterinary clinics, and animal shelters to keep track of pets' details through a user-friendly interface. The system supports user registration, login, and comprehensive CRUD operations for pet profiles.

---

## Project Details

### Features
- User registration and login with secure password hashing
- Add, view, update, and delete pet records
- View individual pet details by custom Pet ID
- Automatically generates unique Pet IDs based on species, breed, gender, and random digits
- Multiple frontend HTML pages for different user flows
- MongoDB integration for storing user and pet data
- CORS-enabled API for cross-origin frontend-backend interaction

### Backend API Endpoints
- `/api/register` (POST): Register a new user
- `/api/login` (POST): User login
- `/api/pets` (POST): Add a new pet
- `/api/pets` (GET): List all pets
- `/api/pets/<petId>` (GET): Get details of a specific pet
- `/api/pets/<petId>` (PUT): Update a pet's details
- `/api/pets/<petId>` (DELETE): Delete a pet
- Static routes for serving HTML pages

### Frontend
- Responsive HTML pages for login, registration, home, pet list, pet update, and entry
- Custom and Bootstrap-based CSS for styling
- JavaScript for dynamic pet list updates

---

## Tech Stack
- **Frontend:** HTML, CSS (Bootstrap 5, custom styles), JavaScript
- **Backend:** Python (Flask)
- **Database:** MongoDB
- **Security:** werkzeug.security (password hashing)
- **Other Libraries:** Flask-CORS, pymongo

---

## Getting Started

### Prerequisites
- Python 3.x
- MongoDB running on `localhost:27017`

### Installation
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/DCode-v05/Pet-Management-System.git
   cd Pet-Management-System
   ```
2. **Install Dependencies:**
   ```bash
   pip install flask pymongo flask-cors werkzeug
   ```
3. **Run the Application:**
   ```bash
   python server.py
   ```
4. **Access the Application:**
   Open your browser and go to [http://localhost:5000](http://localhost:5000)

---

## Usage
- Register a new user or login with existing credentials
- Add new pets with details such as species, breed, gender, etc.
- View, update, or delete pet records
- Use the pet list and search features to manage pets efficiently

---

## Project Structure
```
Pet-Management-System/
├── public/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   └── style.css
│   ├── entry.html
│   ├── home.html
│   ├── login.html
│   ├── petlist.html
│   ├── register.html
│   ├── update.html
│   └── updated-petlist.js
├── server.py
└── README.md
```
- **public/**: Frontend HTML, CSS, and JS files
- **server.py**: Flask backend API and server logic

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request describing your changes.

---

## Contact
- **GitHub:** [DCode-v05](https://github.com/DCode-v05)
- **Email:** denistanb05@gmail.com
