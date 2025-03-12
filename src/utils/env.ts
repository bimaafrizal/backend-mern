import dotenv from 'dotenv';

dotenv.config();


export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
export const DB_NAME = process.env.DB_NAME || 'wpu-db';
export const SECRET = process.env.SECRET || 'secret';