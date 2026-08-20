# The Heritage Market
A platform for students to buy/sell goods and services in your school's community.

I made this platform to make it easier for students to trade things in their school, such as textbooks. Reselling used books after a school year is sometimes difficult, so why not have a platform for your school, where these books are used, and have students who will need them next year find them? (I also added possibility for services)

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
git clone https://github.com/ivg1/theHeritageMarket.git
cd theHeritageMarket

#Install dependencies and start dev servers
cd frontend
npm install
#If you get npm warn and error, run: rm package-lock.json (cus I have to on my server)
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

#### 2. Run the query below.
There is a folder called ```db``` in which you will find 2 files.
The one we want is ```creating_db_tables.sql```:

```sql
create table users (
	id integer generated always as identity primary key,
	username text not null,
	email text not null,
	password_hash text not null,
	phone text,
	created_at timestamp default current_timestamp
);

create table listings (
	id integer generated always as identity primary key,
	title text not null,
	description text,
	price integer,
	tags text[],
	images text[],
	seller_id integer references users(id),
	seller_email text,
	seller_phone text,
	emailShow bool default false,
	phoneShow bool default false,
	created_at timestamp default current_timestamp,
	visibility bool default true
);

create table stats (
    id integer generated always as identity primary key,
    total_listings_created bigint default 0
);
insert into stats (total_listings_created) values (0);
```


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
