import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLOUD_API_KEY:process.env.CLOUD_API_KEY,
    CLOUD_SECRET_KEY:process.env.CLOUD_SECRET_KEY,
    CLOUD_NAME:process.env.CLOUD_NAME,
    INNGEST_KEY: process.env.INNGEST_KEY,
};