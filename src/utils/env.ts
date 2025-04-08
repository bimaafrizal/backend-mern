import dotenv from 'dotenv';

dotenv.config();


export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
export const DB_NAME = process.env.DB_NAME || 'wpu-db';
export const SECRET = process.env.SECRET || 'secret';
export const LOCAL_HOST = process.env.LOCAL_HOST || 'http://localhost:3000';
export const PROD_HOST = process.env.PROD_HOST || 'https://wpu-api.vercel.app';