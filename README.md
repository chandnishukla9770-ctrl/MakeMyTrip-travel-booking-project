# MakeMyTrip – Travel Booking Website

A full-stack travel booking web application built using **React.js** for the frontend and **Django REST Framework** for the backend.

#  Project Overview

MakeMyTrip Travel Booking Project allows users to explore popular travel destinations, view hotels and travel packages, register/login, and make travel bookings through a user-friendly web interface.

The project demonstrates frontend and backend integration using REST APIs.

#  Features

* User Registration
* User Login and Authentication
* Browse Travel Destinations
* View Hotels
* View Travel Packages
* View Package Details
* Travel Booking
* My Bookings
* Booking Management
* Django Admin Panel
* REST API integration
* Responsive React frontend

##  Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* React Router
* Vite

### Backend

* Python
* Django
* Django REST Framework

### Database

* SQLite3

### Tools

* Visual Studio Code
* Git
* GitHub
* Postman

##  Project Structure

text
MakeMyTrip_Project/
│
├── MakeMyTrip-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── accounts/
├── bookings/
├── destinations/
├── hotels/
├── travel/
├── makemytrip/
├── manage.py
└── .gitignore


##  Installation and Setup

### 1. Clone the Repository


git clone https://github.com/chandnishukla9770-ctrl/MakeMyTrip-travel-booking-project.git


### 2. Open the Project


cd MakeMyTrip-travel-booking-project


### 3. Create and Activate Virtual Environment


python -m venv env


For Windows:


env\Scripts\activate


### 4. Install Backend Dependencies


pip install django djangorestframework


### 5. Run Database Migrations


python manage.py migrate


### 6. Start Django Backend


python manage.py runserver


The backend will run at:


http://127.0.0.1:8000/


### 7. Start React Frontend

Open another terminal and go to the frontend folder:


cd MakeMyTrip-frontend


Install dependencies:


npm install


Start the React development server:


npm run dev


The frontend will run on the URL shown by Vite, usually:


http://localhost:5173/


##  API Integration

The React frontend communicates with the Django REST API using **Axios**.

Main API areas include:

* Accounts / Authentication
* Destinations
* Hotels
* Travel Packages
* Bookings

##  User Flow

```text
Register
   ↓
Login
   ↓
Explore Destinations
   ↓
View Hotels / Packages
   ↓
Select Travel Package
   ↓
Make Booking
   ↓
View My Bookings
```

##  Project Objective

The main objective of this project is to develop a full-stack travel booking platform and demonstrate practical implementation of:

* React.js frontend development
* Django backend development
* REST API development
* API integration
* User authentication
* Database management
* CRUD operations
* Frontend and backend communication

##  Developed By

**Chandni Shukla**

Full Stack Web Development Internship Project

##  License

This project was developed for educational and internship purposes.
