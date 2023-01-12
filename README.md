# minerva-bridge

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/minerva-bridge
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

4. Start a postgres docker instance
    
    ```
    docker run --name minerva-bridge -e POSTGRES_PASSWORD=password -p 49159:5432 -d postgres
    ```
  Note that you can change the port after the -p option, before the colon (makes sure to leave 5432).

5. Start a lrsql docker instance

    ```
    docker run -it -p 8080:8080 -e LRSQL_API_KEY_DEFAULT=my_key -e LRSQL_API_SECRET_DEFAULT=my_secret -e LRSQL_ADMIN_USER_DEFAULT=my_username -e LRSQL_ADMIN_PASS_DEFAULT=my_password -e LRSQL_ALLOW_ALL_ORIGINS=true -e LRSQL_DB_NAME=db/lrsql.sqlite.db -v lrsql-db:/lrsql/db yetanalytics/lrsql:latest
    ```
6. Edit ./config/default.json, line 30, "postgres" object to "postgres://postgres:password@localhost:49159" 
or with the port selected at 4).

7. Edit ./config/default.json, line 31, lrsql.username to "my_key" and lrsql.password to "my_secret"

8. To open and browse lrsql LRS go to http://localhost:8080/admin/index.html, login with Username: my_username and Password: my_password
## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
