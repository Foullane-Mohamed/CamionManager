# 🚛 Fleet Management System - Frontend

> Modern React-based fleet management application with role-based access control, complete CRUD operations, and responsive design.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Tech Stack](#-tech-stack)
- [Development](#-development)
- [Status](#-status)

---

## ✨ Features

### ✅ Implemented

- 🔐 **Authentication System**

  - Login with JWT tokens
  - Chauffeur registration with admin approval
  - Pending approval workflow
  - Auto-logout on session expiry

- 🎨 **Modern Layout**

  - Responsive header with user menu
  - Collapsible sidebar navigation
  - Role-based menu filtering
  - Mobile-first design
  - Sticky footer

- 🚚 **Fleet Management**

  - Complete Trucks CRUD
  - Complete Trailers CRUD
  - Users management (admin)
  - Trip tracking (partial)

- ⚙️ **Technical Features**
  - Role-based access control
  - Form validation with Zod
  - Toast notifications
  - Protected routes
  - Axios interceptors

### 🔄 In Progress

- Trips management
- Fuel records
- Maintenance tracking
- Tire management
- Dashboard statistics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 3000

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL
VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

### Access the App

```
🌐 Local:   http://localhost:5173
📧 Login:   Use your registered credentials
🔑 Default: No default users (register as chauffeur)
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── layout/         # Layout components
│       ├── Layout.jsx      # Main layout container
│       ├── Header.jsx      # Top navigation bar
│       ├── Sidebar.jsx     # Side navigation menu
│       └── Footer.jsx      # Bottom footer
│
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard
│   ├── trucks/        # Trucks management (COMPLETE)
│   ├── trailers/      # Trailers management (COMPLETE)
│   ├── users/         # Users management (COMPLETE)
│   ├── trips/         # Trips management (PARTIAL)
│   ├── fuels/         # Fuel records (TODO)
│   ├── maintenances/  # Maintenance (TODO)
│   └── tires/         # Tires management (TODO)
│
├── services/           # API service functions
│   ├── auth.service.js
│   ├── truck.service.js
│   ├── trailer.service.js
│   └── ...
│
├── validation/         # Zod validation schemas
│   ├── auth.schema.js
│   ├── truck.schema.js
│   └── ...
│
├── context/           # React Context providers
│   ├── AuthContext.jsx    # Authentication state
│   └── AppContext.jsx     # Global app state
│
├── routes/            # Route configuration
│   └── appRoutes.jsx
│
└── api/               # API configuration
    └── axiosInstance.js   # Axios setup with interceptors
```

---

## 📚 Documentation

We have comprehensive documentation! Start here:

### 🎯 Essential Reading

- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Index of all docs
- **[QUICK_START.md](./QUICK_START.md)** - Getting started guide
- **[SESSION_COMPLETE_SUMMARY.md](./SESSION_COMPLETE_SUMMARY.md)** - Recent updates

### 📖 Detailed Guides

- **[LAYOUT_SYSTEM.md](./LAYOUT_SYSTEM.md)** - Layout architecture
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Development guide
- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Project status

### 🆕 Recent Updates

- **[REGISTER_UPDATE_SUMMARY.md](./REGISTER_UPDATE_SUMMARY.md)** - Registration changes
- **[PENDING_APPROVAL_FEATURE.md](./PENDING_APPROVAL_FEATURE.md)** - Approval workflow
- **[LAYOUT_REFACTORING_SUMMARY.md](./LAYOUT_REFACTORING_SUMMARY.md)** - Layout changes

---

## 🛠️ Tech Stack

### Core

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **React Router DOM v7** - Routing

### Styling

- **Tailwind CSS v4** - Utility-first CSS
- **Custom Components** - No external component library

### State & Data

- **React Context** - Global state management
- **TanStack Query** - Server state management
- **Axios** - HTTP client

### Forms & Validation

- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Notifications

- **React Toastify** - Toast notifications

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Workflow

1. **Create a new feature branch**

   ```bash
   git checkout -b feature/your-feature
   ```

2. **Follow existing patterns**

   - Check `src/pages/trucks/` for CRUD reference
   - Use services in `src/services/`
   - Apply validation from `src/validation/`

3. **Test your changes**

   - Check all responsive breakpoints
   - Test both admin and chauffeur roles
   - Verify form validation

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add fuel records CRUD"
   ```

### Code Style

- Use functional components with hooks
- Follow existing file naming conventions
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic

---

## 📊 Status

### Completion Overview

| Module              | Status      | Progress   |
| ------------------- | ----------- | ---------- |
| Core Infrastructure | ✅ Complete | 100%       |
| Authentication      | ✅ Complete | 100%       |
| Layout System       | ✅ Complete | 100%       |
| Services            | ✅ Complete | 100% (8/8) |
| Validation          | ✅ Complete | 100% (8/8) |
| Trucks CRUD         | ✅ Complete | 100%       |
| Trailers CRUD       | ✅ Complete | 100%       |
| Users Management    | ✅ Complete | 100%       |
| Trips CRUD          | 🔄 Partial  | 25%        |
| Fuel CRUD           | 📝 TODO     | 0%         |
| Maintenance CRUD    | 📝 TODO     | 0%         |
| Tires CRUD          | 📝 TODO     | 0%         |
| Dashboard           | 📝 TODO     | 10%        |

**Overall Progress:** ~60% Complete

### Recent Updates (Dec 11, 2025)

- ✅ Fixed registration form (added dateOfBirth)
- ✅ Created pending approval page
- ✅ Refactored layout system (4 new components)
- ✅ Added comprehensive documentation

---

## 🎯 Next Steps

### Priority 1: Complete CRUD Pages

- [ ] Finish Trip Create/Edit/View pages
- [ ] Implement Fuel Records full CRUD
- [ ] Implement Maintenance full CRUD
- [ ] Implement Tires full CRUD

### Priority 2: Dashboard

- [ ] Add statistics cards
- [ ] Add charts (fuel, maintenance)
- [ ] Add recent activity feed

### Priority 3: Enhancements

- [ ] Add pagination to lists
- [ ] Add data export (PDF, Excel)
- [ ] Add search improvements
- [ ] Add user profile page

---

## 🤝 Contributing

1. Read **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**
2. Check **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** for tasks
3. Follow existing code patterns
4. Update documentation for new features
5. Test thoroughly before committing

---

## 📝 License

[Add your license here]

---

## 👥 Team

[Add team members here]

---

## 📞 Support

- 📧 Email: [your-email]
- 🐛 Issues: [GitHub Issues URL]
- 📖 Docs: See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

## 🙏 Acknowledgments

Built with:

- React team for an amazing framework
- Tailwind CSS for utility-first styling
- Vite for blazing fast development
- Open source community

---

**Last Updated:** December 11, 2025  
**Version:** 1.0.0  
**Status:** Active Development 🚀
