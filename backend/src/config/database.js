import pg from 'pg';
import dotenv from 'dotenv';

// Çevre değişkenlerini yükle
dotenv.config();

const { Pool } = pg;

// Veritabanı bağlantı havuzu
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Bağlantı olaylarını dinle
pool.on('connect', () => {
  console.log('Veritabanı bağlantısı kuruldu');
});

pool.on('error', (err) => {
  console.error('Beklenmeyen veritabanı hatası:', err);
  process.exit(-1);
});

// Veritabanı bağlantısını test etmek için
export const testDatabaseConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('Veritabanı bağlantı testi başarılı');
    return true;
  } catch (error) {
    console.error('Veritabanı bağlantı testi başarısız:', error);
    return false;
  } finally {
    if (client) client.release();
  }
};

export default pool;