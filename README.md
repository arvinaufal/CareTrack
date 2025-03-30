# CareTrack: Tracking Patient's Medical Records

CareTrack is a web-based application designed to function as a patient medical record management system. It was developed to fulfill the technical test requirements for CareNow.

## Table of Contents
- [CareTrack: Tracking Patient's Medical Records](#caretrack-tracking-patients-medical-records)
  - [Table of Contents](#table-of-contents)
  - [Technology Used and How It Works](#technology-used-and-how-it-works)
    - [\> Technology Stack :](#-technology-stack-)
      - [1. **ExpressJs**](#1-expressjs)
      - [2. **ReactJs**](#2-reactjs)
      - [4. **PostgreSQL**](#4-postgresql)
  - [Installation and Environment Setup](#installation-and-environment-setup)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
      - [1. Clone the repository:](#1-clone-the-repository)
      - [2. Set up the backend:](#2-set-up-the-backend)
      - [3. Set up the frontend:](#3-set-up-the-frontend)
  - [API endpoints in ExpressJs](#api-endpoints-in-expressjs)
    - [Available Endpoints:](#available-endpoints)
  - [Contact](#contact)


## Technology Used and How It Works

### > Technology Stack :

#### 1. **ExpressJs**
   - **Role**: Backend Framework
   - **Description**: ExpressJs is used to build the RESTful API that handles data processing, authentication, and storage. It provides a robust and scalable foundation for the backend.
   - **How It Works**:
     - ExpressJs receives datas from the frontend via API requests.
     - It processes the datas, performs validations, and stores it in the PostgreSQL database.
     - ExpressJs also integrates with Gmail Notification to trigger email verification flow.

#### 2. **ReactJs**
   - **Role**: Frontend Framework
   - **Description**: ReactJs is used to build a responsive and dynamic web application that allows clients to submit their requests and view responses.
   - **How It Works**:
     - The frontend communicates with the ExpressJs backend via REST API.
     - It provides a user-friendly interface for clients to input their data and view the data results.

#### 4. **PostgreSQL**
   - **Role**: Database
   - **Description**: PostgreSQL is used as the primary database to store client data and request details.
   - **How It Works**:
     - All client data and request information are securely stored in PostgreSQL.
     - The ExpressJs backend interacts with PostgreSQL to retrieve and update data as needed.
<br>

## Installation and Environment Setup

### Prerequisites
- NodeJs 22.x (Latest)
- Node.js and npm
- PostgreSQL
- Git

### Steps
#### 1. Clone the repository:
  + Clone the github repository
    ```bash
    git clone https://github.com/arvinaufal/CareTrack
    ```
  + Move to the project folder
    ```bash
    cd caretrack
    ```

#### 2. Set up the backend:
  + Move to the backend project folder from your root project folder
    ```bash
      cd caretrack-server
    ```

  + Install the required packages
    ```bash
      npm install
    ```
  + In the backend project folder, add a `.env` file with the following content:
    ```env
        NODE_ENV=
        SECRET_KEY=
        SECRET_KEY_ENCRYPT=
        APP_USER_GMAIL=
        APP_PASSWORD_GMAIL=
        FRONTED_URL=
    ```

  + Create the database on your local computer or live database
    ```env
        npx sequelize-cli db:create
    ```

  + Run the migration
    ```bash
        npx sequelize-cli db:migrate
    ```

  + Run the development server
    ```bash
        npx nodemon bin/www
    ```

#### 3. Set up the frontend:
  + Move to the frontend project folder from your root project folder
    ```bash
      cd caretrack-app
    ```
  + Install the required packages
    ```bash
        npm install
    ```

  + Run the development project
    ```bash
      npm run dev
    ```

## API endpoints in ExpressJs
### Available Endpoints:

 + /api/masters/patients - API for CRUD Patient.

 + /api/masters/medicines - API for CRUD Medicine.

 + /api/masters/treatments - API for CRUD Treatment.

 + /api/login - API for Login.
 + /api/register - API for Register.
 + /api/verify - API for Verify Account.
 + /api/statistic - API for statistic.
 + /api/patient - API for patient data.
 + /api/export - API for export.


## Contact

If you have any questions or encounter any problems during the installation, please do not hesitate to contact me on WhatsApp: +625175104250 or on Gmail: arvinaufalagustian@gmail.com