import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise';

// A pool (rather than a single connection) gives us concurrent queries and
// automatic replacement of connections killed by MySQL's wait_timeout.
// Unlike createConnection, createPool is synchronous, so the memoised
// singleton below has no await gap and can never race: two concurrent
// first requests always share the same pool.
const createDb = () => drizzle(mysql.createPool(process.env.DATABASE_URL!));

let db: ReturnType<typeof createDb> | null = null;

// The instance is created lazily (not at module scope) so a missing or
// invalid DATABASE_URL only fails requests that actually touch the
// database, instead of crashing module evaluation for every route.
export const getDb = () => (db ??= createDb());
