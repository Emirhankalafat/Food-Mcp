import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Doğru .env dosyasını yükle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const { Pool } = pg;

// URL formatını doğrula

if (!process.env.DATABASE_URL) {
  console.error("HATA: DATABASE_URL çevre değişkeni tanımlanmamış!");
}

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
  
  // URL'i güvenli bir şekilde görüntüle (şifreyi maskele)
  if (process.env.DATABASE_URL) {
    const safeUrl = process.env.DATABASE_URL.replace(
      /postgresql:\/\/([^:]+):([^@]+)@/,
      "postgresql://$1:******@"
    );
    console.error("Bağlantı URL'i (şifre gizli):", safeUrl);
  }
});

// Veritabanı bağlantısını test etmek için
export const testDatabaseConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('Veritabanı bağlantı testi başarılı');
    return true;
  } catch (error) {
    console.error('Veritabanı bağlantı testi başarısız:', error.message);
    
    // URL'i güvenli bir şekilde görüntüle
    if (process.env.DATABASE_URL) {
      const safeUrl = process.env.DATABASE_URL.replace(
        /postgresql:\/\/([^:]+):([^@]+)@/,
        "postgresql://$1:******@"
      );
      console.error("Kontrol edilmesi gereken bağlantı URL'i:", safeUrl);
    }
    
    return false;
  } finally {
    if (client) client.release();
  }
};

export default pool;