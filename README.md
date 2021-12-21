# Code Tricks (Backend)

This repository is the backend for the "code tricks" project.
This project is hosted on ~~[not yet](https://fake.com)~~ 

It intends to provide a place where you can find some pre elaborated code recipes for certain easy but common tasks, so you don't have to repeat over and over again the same scripts.

## Description
This is a *MongoDB Express.js Nodejs* based backend server. 
It contains the endpoints for serving data, and its validators

## How to use
1.use the command `npm run start-dev` for start the development server
2.use the command `npm start` for running the production server (not ready...)

__in both cases__, you need to manually create a file named:

    /config.env

this file should be located on the root directory (`/`) and must contain some environment variables that are required for running the server

    DB_CONN_STRING=your_string_to_connect_to_mongo_db
    JWT_COOKIE_EXPIRATION=number_with_expiration_on_days
    JWT_KEY=a_secure_key_to_hash_the_tokens
    JWT_EXPIRATION=a_string_with_expiration

replace all the values after `=` with the actual information needed , otherwise the server __will fail__
the expiration string must follow the [vercel/ms](https://github.com/vercel/ms) format

>Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").


###Contacts
You're welcome to collaborate with the project at any time.
if you want to contact, please feel free to email me at:
robmanganelly@gmail.com
