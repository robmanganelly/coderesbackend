# Code Tricks (Backend)

This repository is the backend for the "code tricks" project.
This project is hosted on ~~nowhere yet~~

This is an experimental project, but also intends to provide a place where you can find some pre elaborated code recipes for certain easy but common tasks, so you don't have to repeat over and over again the same scripts.

---

## Docker Section

If you prefer to use a [dockerized](https://docs.docker.com/ "Docker Official Documentation") version of this server, please refer to [the docker hub image](https://hub.docker.com/repository/docker/robmanganelly/code-tricks "https://hub.docker.com/r/robmanganelly/code-tricks"). The dockerized __"latest"__ version is intended only for __production__ server, and you can use it with your own cluster and keys by passing the [environment variables](#environment) while running

To use the dockerized version locally:

    docker login -u _your_username_ -p _your_pass
    docker run -e "all_variables_here, comma separated" -dp 3000:3000 --name code-tricks robmanganelly/code-tricks 

You must login for getting access to the repository, also, if you fail passing the environment variables the server will __not__ run.
the `--name` option is optional but can help you on further calls to `run`
for running a dev server locally you just need to run:

    docker login -u _your_username_ -p _your_pass
    docker pull robmanganelly/code-tricks:dev
    docker-compose up

note that the __robmanganelly/code-tricks:dev__ version __should not__ be used on production.

---

## Description

This is a *MongoDB Express.js Nodejs* based backend server.
It contains the endpoints for serving data, and its validators

## How to use

1.use the command `npm run start-dev` for start the development server
2.use the command `npm start` for running the production server (not ready...)

__in both cases__, you need to manually create a file named:

    /config.env

<a id=environment></a>

## Environment variables

this file should be located on the root directory (`/`) and must contain some environment variables that are required for running the server.
> If you are using codkerized version pass these variables as arguments in the command  
`docker run -e var=value,var=value ...`
see docker section for details on running

    JWT_COOKIE_EXPIRATION=number_with_expiration_on_days
    JWT_KEY=a_secure_key_to_hash_the_tokens
    JWT_EXPIRATION=a_string_with_expiration
    DB_USERNAME=username_in_your_mongodb_cluster
    DB_PASSWORD=your_password_in_the_mongodb_cluster
    DB_CLUSTER_URL=your_cluster's_url

>~~`DB_CONN_STRING=your_string_to_connect_to_mongo_db`~~

this environment variable was replaced, so if you are using a previous version of config.env, please remove it and add the new ones.

>In the case of development server, you don't need providing DB variables, since it uses a local version of mongodb, but you must ensure [having a local version of mongodb installed and running](https://docs.mongodb.com/guides/server/install/) on your machine.

replace all the values after `=` with the actual information needed , otherwise the server __will fail__
the expiration string must follow the [vercel/ms](https://github.com/vercel/ms) format

>Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").

### Contacts

You're welcome to collaborate with the project at any time.
if you want to contact, please feel free to email me at:
robmanganelly@gmail.com
