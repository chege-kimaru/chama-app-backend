<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

### NestJs starter

Open `README-nest.md` to get started with Nest

This nest starter project has the following features:

- Auth module
  - Register/Login with email/password, including email verification
  - Sign in with Facebook and Google
  - JWT authentication
  - Role based authorization
- Email Subscription module
- Payment module
  - [Flutterwave Rave](https://ravepay.co/) Integration
- Cloudinary Integration
- Email integration
  - hint: use etherium for development
- Sequelize ORM using migrations
  - See instructions for working with sequelize in the sections below
- Open Api (Swagger) Documentation using @Nest/Swagger
- Testing using @Nest/Testing

### configuration

- clone

```
git clone https://github.com/chege-kimaru/nest-starter-2.git project-name
```

- navigate to this directory

```shell script
cd project-name
```

- if you have not installed sequelize-cli yet

```shell script
npm i -g sequelize-cli
```

- You may require to use `sudo` in unix based systems to install it globally

- install packages

```shell script
npm install
```

- configure env by renaming `.env-example` to `.env` and fill in all the blanks accordingly

```shell script
mv .env-example .env
```

- run sequelize ORM migrations. Perform this step once you have modified all migrations in
  `src/sequelize/migrations`. Modify the fields to fit your project's needs and make sure you modify the models in the respective modules eg in `users/model/user.model.ts` and any other
  project files that might have been affected by the changes you have made in your models.

```shell script
sequelize db:migrate
```

- For the above script to work you need to set database environment variables first as
  follows. You'll notice these are the same as those in your `.env` file but the variables in
  `.env` cannot be accessed as the migrations are done outside the runtime of the app.

```sh
export DB_NAME=
export DB_USER=
export DB_PASSWORD=
export DB_HOST=
export DB_PORT=
export DB_DIALECT=
```

- To simplify the process, i have provided a shell script for unix users that can perform common sequelize operations. Follow the instructions below to set it up:

  - Rename `sequelize-example.sh` to `sequelize.sh` as folows

  ```sh
    mv sequelize-example.sh sequelize.sh
  ```

  - Fill in the gaps in `sequelize.sh` with your database config
  - To perform a migration:

  ```sh
    ./sequelize.sh migrate
  ```

  - To perform a rollback:

  ```sh
    ./sequelize.sh rollback
  ```

  - To seed:

  ```sh
    ./sequelize.sh seed
  ```

- run seeds

```shell script
sequelize db:seed:all
```

OR

```sh
./sequelize.sh seed
```

if you had setup `sequelize.sh`

- run the app

```shell script
npm run dev:start
```
