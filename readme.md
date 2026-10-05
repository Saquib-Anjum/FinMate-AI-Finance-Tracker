# 💰 FINMATE

## Smart Personal Finance & Wallet

**5-Day React + Node.js Full-Stack Project**

> Project Blueprint • Architecture • Features • REST APIs • Context API • AI Roadmap

---

## 1. 📌 Project Overview

**FinMate** is a fintech-style personal finance management web application.

Users can manage:

- Income
- Expenses
- Transactions
- Budgets
- Savings goals
- Financial insights

The application consists of a **React frontend** and a **Node.js + Express backend**.

For the initial 5-day version, **JavaScript arrays act as the database**. This keeps the project simple and allows the focus to remain on React, Context API, REST APIs, CRUD operations, and application architecture.

The project is intentionally designed so that the following can be added later:

- MongoDB
- Secure authentication
- Real financial APIs
- AI-powered financial insights
- RAG/AI agent workflows

---

# 2. 🎯 Project Goal

The main goals of FinMate are:

- Build a realistic fintech application that can be completed in approximately **five days**.
- Practice React fundamentals through a meaningful full-stack application instead of isolated examples.
- Use **Context API** to share authentication and financial state across multiple components.
- Build REST APIs using **Node.js + Express**.
- Use JavaScript arrays as a temporary database.
- Create an architecture that can later support **AI-powered financial insights**.

---

# 3. 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | User interface |
| Styling | Tailwind CSS | Responsive UI |
| Routing | React Router DOM | Page navigation and protected routes |
| State Management | Context API + Hooks | Shared application state |
| HTTP Client | Axios | Frontend/backend communication |
| Backend | Node.js + Express | REST API server |
| Middleware | CORS | Frontend/backend communication |
| Database | JavaScript Arrays | Temporary in-memory data store |
| Authentication | Simple demo login/session | Educational authentication |

### ⚠️ Important Security Note

The initial version intentionally does **not** use:

- JWT
- bcrypt
- MongoDB
- Production authentication

This setup is suitable **only for learning/demo purposes**.

> Passwords should never be stored as plain text in a production application.

---

# 4. 🚀 Main Features

## 🔐 Authentication

- Signup
- Login
- Logout
- Current-user state
- Protected routes

## 📊 Dashboard

- Total balance
- Total income
- Total expenses
- Savings
- Recent transactions
- Budget progress
- Spending categories
- Savings goal progress

## 💳 Transactions

- Create transaction
- View transactions
- Update transaction
- Delete transaction
- Search transactions
- Filter by income/expense
- Filter by category

## 💰 Budgets

- Create category budgets
- Track spending
- Show budget progress
- Update budgets

## 🎯 Financial Goals

- Create savings goals
- Track saved amount
- Track progress toward target
- Update goals

## 📈 Analytics

- Category-wise spending
- Monthly financial summaries
- Income vs expense calculations
- Savings calculations

## 🤖 AI-Ready Layer

Future AI functionality can include:

- Spending analysis
- Financial assistant
- Automatic expense categorization
- Savings recommendations
- Goal planning
- Monthly AI reports

---

# 5. 📄 Suggested Pages

```text
/login
/signup
/dashboard
/transactions
/budgets
/goals
/profile
```

`/profile` is optional for the initial version.

---

# 6. 🏗️ Frontend Architecture

The Context API is split into focused contexts so that unrelated state does not become one large global object.

### AuthContext

Responsible for:

```text
user
login()
signup()
logout()
```

### FinanceContext

Responsible for:

```text
transactions
budgets
goals
balance calculations
CRUD actions
```

### Components

Suggested reusable components:

```text
Navbar
Sidebar
DashboardCards
TransactionTable
TransactionModal
BudgetCard
GoalCard
```

### Pages

```text
Login
Signup
Dashboard
Transactions
Budgets
Goals
```

### ProtectedRoute

Prevents unauthenticated users from accessing private pages.

---

# 7. ⚛️ Context API Concept

Without Context API, data such as:

- User
- Transactions
- Budgets
- Goals

may need to be passed through several component levels using props.

This can result in **prop drilling**.

Context API provides a shared context so components can consume required data directly.

### Example Architecture

```text
App
│
├── AuthProvider
│
├── FinanceProvider
│
└── Router
    │
    ├── Login
    ├── Signup
    │
    └── Protected Routes
        │
        ├── Dashboard
        ├── Transactions
        ├── Budgets
        └── Goals
```

---

# 8. 📁 Backend Folder Structure

```text
backend/
│
├── server.js
│
├── data/
│   ├── users.js
│   ├── transactions.js
│   ├── budgets.js
│   └── goals.js
│
├── routes/
│   ├── authRoutes.js
│   ├── transactionRoutes.js
│   ├── budgetRoutes.js
│   └── goalRoutes.js
│
├── controllers/
│   ├── authController.js
│   ├── transactionController.js
│   ├── budgetController.js
│   └── goalController.js
│
└── middleware/
    └── cors.js
```

---

# 9. 🗄️ Example Array Database

For the initial version, JavaScript arrays are used as an in-memory database.

### Transactions

```javascript
const transactions = [
  {
    id: 1,
    userId: 1,
    type: "income",
    title: "Salary",
    amount: 60000,
    category: "Salary",
    date: "2026-10-01"
  },
  {
    id: 2,
    userId: 1,
    type: "expense",
    title: "Amazon Shopping",
    amount: 2500,
    category: "Shopping",
    date: "2026-10-01"
  }
];
```

### Important

Array-based storage means:

- Data exists only while the server is running.
- Restarting the server resets the data.
- Multiple server instances cannot reliably share the data.

This is intentional for the five-day educational version.

---

# 10. 🔌 REST API Plan

| Method | Endpoint | Purpose | Feature |
|---|---|---|---|
| POST | `/api/auth/signup` | Create user | Authentication |
| POST | `/api/auth/login` | Login user | Authentication |
| GET | `/api/users/:id` | Get user | Authentication |
| GET | `/api/transactions` | Get transactions | Transactions |
| POST | `/api/transactions` | Add transaction | Transactions |
| PUT | `/api/transactions/:id` | Update transaction | Transactions |
| DELETE | `/api/transactions/:id` | Delete transaction | Transactions |
| GET | `/api/budgets` | Get budgets | Budgets |
| POST | `/api/budgets` | Create budget | Budgets |
| PUT | `/api/budgets/:id` | Update budget | Budgets |
| GET | `/api/goals` | Get goals | Goals |
| POST | `/api/goals` | Create goal | Goals |
| PUT | `/api/goals/:id` | Update goal | Goals |

---

# 11. 📦 Example Data Models

## User

```javascript
{
  id: 1,
  name: "Akarsh",
  email: "akarsh@gmail.com",
  password: "123456"
}
```

> Demo only. Never store plain-text passwords in production.

---

## Transaction

```javascript
{
  id: 101,
  userId: 1,
  type: "expense",
  title: "Amazon Shopping",
  amount: 2500,
  category: "Shopping",
  date: "2026-10-01"
}
```

---

## Budget

```javascript
{
  id: 1,
  userId: 1,
  category: "Food",
  limit: 6000,
  spent: 4500
}
```

---

## Goal

```javascript
{
  id: 1,
  userId: 1,
  title: "Buy MacBook",
  targetAmount: 150000,
  savedAmount: 75000
}
```

---

# 12. 📅 Five-Day Development Plan

## Day 1 — Foundation

### Tasks

- Create React + Vite frontend.
- Create Node + Express backend.
- Configure Tailwind CSS.
- Configure React Router DOM.
- Configure Axios.
- Configure CORS.
- Create application layout.
- Create Navbar.
- Create Sidebar.
- Create Login screen.
- Create Signup screen.
- Create array-based data files.
- Create basic API routes.

### Goal

By the end of Day 1:

```text
React frontend
        ↓
Axios
        ↓
Express backend
        ↓
Array data
```

---

# Day 2 — Authentication + Context API

### Tasks

- Create `AuthContext`.
- Implement signup API.
- Implement login API.
- Implement logout.
- Maintain current-user state.
- Create protected routes.
- Connect authentication state to Navbar.
- Connect authentication state to private pages.

### Goal

The user should be able to:

```text
Signup
   ↓
Login
   ↓
Access Dashboard
   ↓
Logout
   ↓
Protected pages become inaccessible
```

---

# Day 3 — Transactions

### Tasks

Create `FinanceContext`.

Implement:

```text
GET
POST
PUT
DELETE
```

for transactions.

Build:

- Transaction table
- Add transaction modal
- Edit transaction modal
- Delete functionality
- Search
- Income/expense filter
- Category filter

### Goal

Complete transaction CRUD.

---

# Day 4 — Budgets + Goals + Dashboard

### Budgets

Implement:

- Budget CRUD
- Category budgets
- Spending tracking
- Progress indicators

### Goals

Implement:

- Goal creation
- Goal editing
- Saved amount
- Target amount
- Progress tracking

### Dashboard

Complete:

- Balance card
- Income card
- Expense card
- Savings card
- Recent transactions
- Budget progress
- Goal progress

### Derived Calculations

Calculate:

```text
Total Income
Total Expenses
Balance
Total Savings
Budget Usage
Goal Progress
```

---

# Day 5 — Analytics + Polish + AI Preparation

### Tasks

- Add category-wise spending analytics.
- Add monthly spending analytics.
- Improve loading states.
- Improve error states.
- Improve empty states.
- Make UI responsive.
- Refactor components.
- Refactor API structure.
- Create clean service layer.
- Prepare architecture for future AI integration.

### Goal

Finish a polished full-stack project that can be demonstrated in an interview.

---

# 13. 📊 Suggested Dashboard

The dashboard should contain:

```text
┌──────────────────────────────────────────────┐
│                  FINMATE                     │
├──────────────┬──────────────┬───────────────┤
│ Total Balance│ Total Income │ Total Expenses│
├──────────────┴──────────────┴───────────────┤
│                                              │
│              Spending Analytics              │
│                                              │
├────────────────────────┬─────────────────────┤
│ Recent Transactions    │ Budget Progress     │
│                        │                     │
├────────────────────────┴─────────────────────┤
│              Savings Goal Progress            │
├──────────────────────────────────────────────┤
│              AI Insight Card                 │
│              Coming Soon                     │
└──────────────────────────────────────────────┘
```

### Dashboard Components

- Total Balance
- Total Income
- Total Expenses
- Total Savings
- Recent Transactions
- Budget Progress
- Spending by Category
- Savings Goal Progress
- AI Insight Card

---

# 14. 🤖 Future AI Roadmap

FinMate is intentionally designed to become an AI-powered finance application.

## 14.1 AI Spending Analysis

Analyze:

```text
Income
Expenses
Categories
Monthly patterns
Spending changes
```

Then generate plain-language insights.

Example:

> "Your food spending increased by 22% this month compared with last month."

---

## 14.2 AI Financial Assistant

Users can ask questions about their financial data.

Examples:

```text
Where am I spending the most?

How much did I spend on food this month?

Can I save ₹20,000 per month?

What category increased the most?

How much can I save if I reduce shopping expenses?
```

The AI can use the user's transaction data as context.

---

## 14.3 AI Expense Categorization

Automatically classify transactions.

Example:

```text
Input:
"Bought shoes from Nike"

AI Output:
Category → Shopping
```

Another example:

```text
Input:
"Swiggy order"

AI Output:
Category → Food
```

---

## 14.4 AI Goal Planner

User provides:

```text
Goal:
Buy MacBook

Target:
₹150,000

Deadline:
10 months
```

AI can calculate and suggest:

```text
Recommended monthly saving:
₹15,000
```

It can also suggest ways to reach the goal based on spending patterns.

---

## 14.5 Monthly AI Report

Generate a monthly financial report containing:

- Total income
- Total expenses
- Total savings
- Highest spending category
- Spending changes
- Budget performance
- Goal progress
- Personalized recommendations

---

## 14.6 AI/RAG Layer

Later, FinMate can use **RAG (Retrieval-Augmented Generation)** to combine:

```text
User Financial Data
        +
Trusted Financial Education
        ↓
     RAG Layer
        ↓
AI Financial Assistant
```

This can help the assistant explain financial concepts using relevant trusted context.

---

# 15. 🛣️ Future Technology Upgrade Path

The project can evolve through the following phases:

### Phase 1 — Learning Version

```text
JavaScript Arrays
+
Demo Authentication
```

### Phase 2 — Persistent Database

```text
MongoDB
+
Mongoose
```

### Phase 3 — Secure Authentication

```text
bcrypt
+
JWT / Secure Sessions
```

### Phase 4 — Real APIs

Integrate appropriate:

- Financial APIs
- Payment APIs
- Banking data APIs

### Phase 5 — AI

Add:

```text
AI Insights
AI Assistant
AI Categorization
AI Goal Planner
AI Reports
```

### Phase 6 — Advanced AI Architecture

Add:

```text
RAG
Agents
Tool Calling
Monitoring
Permissions
Production Security
```

---

# 16. 📚 Learning Outcomes

By completing FinMate, you will practice:

### React

- Component architecture
- `useState`
- `useEffect`
- `useMemo`
- Context API
- `useContext`
- Forms
- CRUD UI
- Reusable components

### Routing

- React Router DOM
- Nested routes
- Protected routes
- Navigation

### Frontend Architecture

- Context separation
- Service layer
- Component composition
- Derived state
- Loading states
- Error states
- Empty states

### API Integration

- Axios
- REST APIs
- HTTP methods
- API error handling
- Frontend/backend communication

### Backend

- Node.js
- Express
- Routing
- Controllers
- Middleware
- CORS
- REST API design

### Data Management

- Temporary array-based persistence
- CRUD operations
- Data filtering
- Data calculations

### Application Design

- Fintech-style dashboard
- Responsive UI
- Scalable project structure
- AI-ready architecture

---

# 17. ⚠️ Important Scope Rule

Keep the five-day version focused.

Do **not** attempt the following in the first version:

- Real banking
- Real payment processing
- Investment execution
- Production-grade authentication
- Real financial transactions
- Complex AI agents
- Production financial advice

The goal is to build a **strong full-stack educational project** with a fintech use case and a clean path toward a more advanced AI-powered version.

---

# 18. 🎯 Final Project Goal

By the end of the five days, FinMate should demonstrate that you can build a complete full-stack application:

```text
                    FINMATE
                       │
        ┌──────────────┴──────────────┐
        │                             │
     FRONTEND                      BACKEND
        │                             │
      React                         Node.js
        │                          Express
      Vite                            │
        │                         REST APIs
   Tailwind CSS                       │
        │                         Array Data
        │
   Context API
        │
   React Router
        │
      Axios
        │
        └──────────────┬──────────────┘
                       │
                  FINANCIAL DATA
                       │
          ┌────────────┼────────────┐
          │            │            │
     Transactions   Budgets       Goals
          │            │            │
          └────────────┼────────────┘
                       │
                   Analytics
                       │
                       ▼
                Future AI Layer
                       │
          ┌────────────┼────────────┐
          │            │            │
       AI Insights  AI Assistant  AI Planner
```

---

## 🚀 FinMate Development Philosophy

> **Build simple → Understand deeply → Refactor → Add persistence → Add security → Add AI.**

The first version is not about building a production banking platform.

It is about learning how to design and build a **real-world full-stack application** with a clear architecture that can evolve into a production-grade, AI-powered financial platform.