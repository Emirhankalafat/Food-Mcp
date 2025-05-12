import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SADECE 2 kez yukarı çıkıyoruz:
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// DATABASE_URL kontrolü
if (!process.env.DATABASE_URL) {
  console.error("❌ HATA: DATABASE_URL çevre değişkeni tanımlanmamış!");
  process.exit(1);
}

// Pool oluştur
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Bağlantı eventleri
pool.on('connect', () => {
  console.error('✅ Veritabanı bağlantısı kuruldu');
});

pool.on('error', (err) => {
  console.error('❌ Beklenmeyen veritabanı hatası:', err);
});

// Bağlantı testi fonksiyonu
export const testDatabaseConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.error('✅ Veritabanı bağlantı testi başarılı');
    return true;
  } catch (error) {
    console.error('❌ Veritabanı bağlantı testi başarısız:', error.message);

    if (process.env.DATABASE_URL) {
      const safeUrl = process.env.DATABASE_URL.replace(
        /postgresql:\/\/([^:]+):([^@]+)@/,
        "postgresql://$1:******@"
      );
      console.error("🔒 Kontrol edilmesi gereken bağlantı URL'i:", safeUrl);
    }

    return false;
  } finally {
    if (client) {
      try { client.release(); } catch (err) { console.error("❗ Client release hatası:", err.message); }
    }
  }
};
