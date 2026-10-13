## Portfolio CMS



A personal portfolio website with a custom admin dashboard for managing portfolio content. The project uses React for the frontend, Django REST Framework for the backend API, and PostgreSQL for data storage.



##### **Features**



Responsive personal portfolio website

Projects management through an admin dashboard

Skills management

Education and experience management

Contact form for visitor messages

JWT-based authentication for protected admin functionality

REST API integration between frontend and backend

PostgreSQL database integration



##### **Tech Stack**



**Frontend**

React

Vite

JavaScript

CSS



**Backend**

Python

Django

Django REST Framework

Simple JWT



**Database**

PostgreSQL



**Development Tools**

Git and GitHub

npm

Python virtual environment





##### **Project Structure**



portfolio-cms/

├── backend/

│   ├── cms/

│   ├── config/

│   ├── portfolio/

│   ├── manage.py

│   └── requirements.txt

├── frontend/

│   ├── public/

│   ├── src/

│   ├── package.json

│   └── vite.config.js

└── README.md



##### **Getting Started**



**Prerequisites**

Install the following before running the project:

Python

Node.js and npm

PostgreSQL



1\. Clone the repository

git clone https://github.com/mxtss/portfolio-cms.git

cd portfolio-cms



2\. Configure the backend

Open a terminal in the project root.

cd backend

python -m venv .venv



Activate the virtual environment on Windows:

.\\.venv\\Scripts\\Activate.ps1



Install dependencies:

pip install -r requirements.txt



Create a .env file inside the backend directory and configure your local environment variables:



DJANGO\_SECRET\_KEY=your-secret-key

DJANGO\_DEBUG=True

DJANGO\_ALLOWED\_HOSTS=localhost,127.0.0.1



DB\_NAME=portfolio\_cms

DB\_USER=your-postgres-username

DB\_PASSWORD=your-postgres-password

DB\_HOST=localhost

DB\_PORT=5432



CORS\_ALLOWED\_ORIGINS=http://localhost:5173



Create the PostgreSQL database named portfolio\_cms before running migrations.



**Apply migrations:**

python manage.py migrate

Create an admin account if you do not already have one:

python manage.py createsuperuser



Start the backend server:

python manage.py runserver

The backend will run at http://127.0.0.1:8000/.



3\. Configure the frontend



Open a second terminal:

cd frontend

npm install

npm run dev

The frontend development server will run at the local URL displayed by Vite, typically http://localhost:5173/.



##### **API Overview**

The backend exposes REST API endpoints for portfolio content and authentication, including functionality for:

* Projects
* Skills
* Education
* Experience
* Contact messages
* Admin authentication

The exact endpoint paths and supported HTTP methods are defined in the backend URL configuration.



##### **Security Notes**

Keep .env files and credentials out of version control.

Use a strong, unique Django secret key.

Configure production environment variables before deployment.

Disable Django debug mode in production.

Configure allowed hosts and CORS for the deployed domains.



##### **Future Improvements**



Production deployment

Additional UI and accessibility improvements

Automated testing and expanded documentation



Author

Mitali 

GitHub: @mxtss

