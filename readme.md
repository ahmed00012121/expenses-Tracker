# 💰 Expense Tracker

##  Project Description
Expense Tracker is a full-stack web application designed to help users manage and monitor their personal expenses in one place. Users can securely create an account, record transactions, organize expenses by category, and view financial information through dashboards and reports.
The project was built to practice full-stack web development, REST API development, database management, authentication, and responsive frontend design.


## Features
- 🔐 User registration and login
- 🔑 JWT-based authentication
- 💸 Add expenses and transactions
- ✏️ Edit transaction information
- 🗑️ Delete transactions
- 🏷️ Expense categories
- 📊 Financial dashboard
- 📈 Expense reports
- 👤 Profile management
- 🖼️ Transaction image upload
- 📅 Transaction date management
- 💰 INR (₹) currency support
- 📱 Responsive web interface
- 🔒 Protected user data and API routes


##  Tech Stack
| HTML5 | Frontend structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MongoDB | Database |
| Mongoose | MongoDB data modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| Git & GitHub | Version control |


##  Project Architecture
                    ┌─────────────────────────┐
                    │        User             │
                    │  Browser / Web Interface │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       Frontend          │
                    │  HTML + CSS + JavaScript│
                    │                         │
                    │ Login • Dashboard       │
                    │ Expenses • Reports      │
                    │ Profile                 │
                    └────────────┬────────────┘
                                 │
                         HTTP / REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        Backend          │
                    │   Node.js + Express.js  │
                    │                         │
                    │ Routes                  │
                    │ Controllers             │
                    │ Middleware              │
                    │ Authentication (JWT)    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        Database         │
                    │         MongoDB          │
                    │                         │
                    │ Users • Expenses        │
                    └─────────────────────────┘


### Project Structure

expense-tracker/
│
├── frontend/
│   │
│   ├── components/
│   │   ├── header.html
│   │   └── footer.html
│   │
│   └── assets/
│       ├── css/ styleing 
│       ├── js/ functionality
│       └── images/
│
├── backend/
│   ├── server.js /entery point
│   ├── config/Database configuration
│   ├── models/Database models
│   ├── routes/API routes
│   ├── controllers/Application logic
│   ├── middleware/ Authentication middleware
│   └── utils/
│
├── .gitignore
├── README.md


## How It Works
User
  │
  ▼
HTML / CSS / JavaScript Frontend
  │
  ▼
Express.js REST API
  │
  ▼
Authentication & Business Logic
  │
  ▼
MongoDB

The frontend sends requests to the Express.js API. The backend validates authentication, processes the request, communicates with MongoDB, and returns the required data to the frontend.

## Screenshots
all images are inside screenshot folder

##  Installation nneed updaet

### 1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd expense-tracker
### 2. Install backend dependencies
cd backend
npm install

### 3. Configure environment variables
Create a `.env` file inside the `backend` folder.
Use `.env.example` as a reference.
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
### 4. Start the application
noder server.js
The application will run on:
http://localhost:5000
The frontend is served automatically by the backend.


## API Information
The backend is organized into separate REST API modules.

| Module         | Purpose                               
| Authentication | Registration, login, logout              |
| Transactions   | Create, view, update and delete          |
| Reports        | Financial and expense reports            |
| Profile        | User profile management                  |
| Dashboard      | Financial summary and dashboard details     |

Main backend route files:
backend/routes/
├── authRoutes.js
├── expenseRoutes.js
├── reportRoutes.js
├── profileRoutes.js
└── dashboardRoutes.js

##  Testing / Usage

The main application workflow can be tested as follows:

1. Register a new user.
2. Log in using the registered account.
3. Open the dashboard.
4. Add an income or expense transaction.
5. Select a category when required.
6. Verify the transaction appears in the dashboard.
7. Edit or delete the transaction.
8. Open Reports to review financial information.
9. Open Profile to view or update account information.
10. Log out and verify that protected pages require authentication.

##  Future Improvements
Planned improvements include:
* 🌐 Online deployment
* 📊 Advanced financial analytics
* 📁 Export reports to PDF/Excel
* 💰 Budget management
* 🔔 Smart spending notifications
* 🤖 AI-powered expense analysis
* 💬 AI financial assistant
* 🎙️ Voice-based expense entry
* 📱 Progressive Web App / mobile support

---

## 👨‍💻 Author

**Ahmed**
* GitHub: `YOUR_GITHUB_USERNAME`
* Project: `Expense Tracker`



