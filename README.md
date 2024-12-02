# ricrym-assesment

Project Setup:
1) Clone the repository.
2) Configure your database credentials in the .env file located in the api/.env directory.
3) Open a terminal for both the api(backend) and frontend directories.
4) Run npm install in both the api(backend) and frontend directories to install the required dependencies.
5) For the api(backend), run node seed.js to generate fake data using the Faker library.

Running the Project:
1) Navigate to 'api/index.js' and please comment code line 27.
2) Start the api(backend) by running nodemon index.js (This project uses Nodemon for development).
3) Navigate to 'frontend/src/axios.js' and comment code line 5 and uncomment code line 4.
4) Start the frontend by running npm run dev.
5) Once the frontend is running, access the project using the URL provided in the terminal.

Tech Stack:
- NodeJS
- VueJS
- PostgreSQL
- TailwindCSS
- Vercel
- Supabase

  Packages:
  - faker
  - sequelize
  - express
  - pg
  - cors
  - dotenv
  - nodemon
  - qrcode
  - axios
  - vite
  - vue-jwt-decode
  - vue-router
  - bcrypt
  - jsonwebtoken
  - speakeasy
