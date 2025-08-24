import 'dotenv/config'; 

const config = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'myapp',
      password: process.env.DB_PASSWORD || 'MyApp@123',
      database: process.env.DB_NAME || 'myapp_db',
      timezone: 'UTC',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

export default config;
