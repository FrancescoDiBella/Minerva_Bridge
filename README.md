# minerva-bridge

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

1. Create a new `docker network`:
    ```
    docker network create minerva_network
    ```

2. Edit `./config/default.json`, line 31, `lrsql.username` to "my_key" and `lrsql.password` to "my_secret"

3. Create an image of `minerva_bridge`:
    ```
    cd path/to/minerva_bridge
    docker build -t minerva_bridge .
    ```

4. Start a `postgres` docker instance:
    
    ```
    docker run --network minerva_network --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
    ```

5. Start a `minerva_bridge` docker instance:

    ```
    docker run -d --network minerva_network -p 3030:3030 --name minervabridge minerva_bridge
    ```

6. Start a `lrsql` docker instance:

    ```
    docker run --network minerva_network --name lrs -p 8080:8080 -e LRSQL_API_KEY_DEFAULT=my_key -e LRSQL_API_SECRET_DEFAULT=my_secret -e LRSQL_ADMIN_USER_DEFAULT=my_username -e LRSQL_ADMIN_PASS_DEFAULT=my_password -e LRSQL_ALLOW_ALL_ORIGINS=true -e LRSQL_DB_NAME=db/lrsql.sqlite.db -v lrsql-db:/lrsql/db yetanalytics/lrsql:latest
    ```

7. To open and browse lrsql LRS go to `http://localhost:8080/admin/index.html`, login with `Username`: my_username and `Password`: my_password
