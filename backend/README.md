# How To Use

- Change environment

```sh
copy .env.example to .env
```

- Preparation

```sh
npm install
```

- Open MySQL/Mariadb client -> Create database name :

```sh
electron_db : for dev purpose
electron_test : for test purpose
```

- Migrate DB

```sh
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

- Run!

```sh
npm run dev
```

## More commands

- Generate schema/migration

```sh
npx sequelize-cli migration:generate --name update-blablabla
```

- Generate seeder

```sh
npx sequelize-cli seed:generate --name demo-user
```

- Run unit test

```sh
npm run test
```

## URL

- API : <http://localhost:3000>

- Swagger Doc : <http://localhost:3000/api-docs>