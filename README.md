# School Market
A platform for students to buy/sell books and other stuff in your school's community.

I made this platform to make it easier for students to trade things in their school, such as textbooks. Reselling used books after a school year is sometimes difficult, so why not have a platform for your school, where these books are used, and have students who will need them next year find them?

*Project is still in development.*

## Features
This project has multiple features:
- Listings displays
- User accounts system
- User account roles (normal user, moderator, and admin)
- Statistics - usage, etc. (planned) (some already implemented)
- Messenger (planned)

## What I used for stack
- **Frontend**: Javascript, React, Tailwind CSS, Flowbite
- **Backend**: Node.js
- **Database**: PostgreSQL 18
- **Build & Dev**: Vite, npm

## Setting up on your device
### Required:
- Download [PostgreSQL 18(.4)](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- [Node.js](https://nodejs.org/en/download) (v22.17.0 or later)
- npm (v10.9.2 or later) (```curl -qL https://www.npmjs.com/install.sh | sh```)

### Installing
```bash
#Clone the github repo
git clone https://github.com/ivg1/schoolMarket.git
cd schoolMarket

#Install dependencies and start dev servers
cd frontend
npm install
#If you get npm warn and error, run: rm package-lock.json and run npm install again
cd ../backend
npm install
```

### Setting up the PostgreSQL database
#### 1. Create the database for this project 
(make sure to write the account credentials and db name in the ```.env``` file).

For example:
```sql
create database theheritagedb;
```

#### 2. Run the query to set up the tables.
There is a folder called ```db``` in which you will find a couple files.
The one we want is ```creating_db_tables.sql```.

### Setting up the backend server
The backend server uses variables from the ```.env``` file. 

There is a template for the variables in the ```.env.example``` file, which you should use.

Steps:
1. Create the .env file in the backend folder: ```nano .env```
2. Copy the template code from ```.env.example``` into the new ```.env``` file.
3. Replace the placeholders with your values.


### Setting up the frontend
In case you want another port for the backend server, or you run it on something other than localhost, dont forget to change the url in 
```
frontend/src/serverComms/server.jsx
```
at where ```url``` is declared.

## Development
For development, or testing, you need to start both the frontend development server, and run the backend server:
```bash
#In the frontend folder
npm run dev
#Then use the URL Vite outputs
```
And in a separate terminal:
```bash
#In the backend folder
node server
```

## Production
For production, first build the frontend files:
```bash
cd frontend
npm run build
```
Then copy the contents of the ```dist``` folder to somewhere, or upload them to a hosting platform like vercel.

That's it.
