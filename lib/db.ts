import 'dotenv/config';
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise';

let dbInstance: MySql2Database<Record<string, unknown>> & {$client: mysql.Connection;} | null = null;

export const getDb = async () => {
    if (!dbInstance) {
        const connection = await mysql.createConnection(process.env.DATABASE_URL!);
        dbInstance = drizzle(connection);
    }
    return dbInstance;
};

