# SEA_Internship Showcase and Tracking Platform_RohanBenegal_10170

# InternHub: Internship Statistics Management Platform

## Overview

Internhub is a comprehensive internship statistics management platform designed to streamline interactions between students, teachers, and administrative staff. The platform facilitates internship applications, student management, and internship resource distribution through a modern web interface.

## Project Structure

The application consists of two main components:

- **Frontend**: A React-based single-page application built with Vite
- **Backend**: A Django-based API server providing data and business logic

### Frontend (`/frontend`)

The frontend is built with modern React (v19) and uses the following technologies:

- **UI Framework**: Material UI (MUI) v7
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Animation**: Framer Motion
- **Build Tool**: Vite

#### Key Features

- Responsive dashboard interfaces for students, teachers, admin and management
- User authentication and authorization
- Internship application system
- Profile management
- Role-based access control

### Backend (`/errorhub`)

The backend is built using Django and consists of several modules:

- **students**: Student account management and data
- **teachers**: Teacher account management and verification
- **managements**: Administrative functions and oversight
- **media**: File storage and management

#### Key Features

- RESTful API endpoints
- User authentication and session management
- Database models for educational entities
- File upload and storage capabilities

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- Django

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd errorhub
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## User Roles

1. **Students**: Can browse available internships, apply for positions, and manage their profiles
2. **Teachers**: Can manage student applications, view student profiles, and create educational content
3. **Management**: Oversees the entire platform, approves teacher accounts, and manages system settings
4. **Admin**: Oversees all the statistics.

Demo Video : https://drive.google.com/drive/folders/126YD1vRu0VhvRgtk7PrKBKGw7hBFIi8N
