import pg from "pg"; 
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// .env dosyasını yükle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// URL formatını doğrula
console.log("Bağlantı URL'i yükleniyor...");
if (!process.env.DATABASE_URL) {
  console.error("HATA: DATABASE_URL çevre değişkeni tanımlanmamış!");
}

// Veritabanı bağlantı havuzu
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// Bağlantıyı test et
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.error("✅ Veritabanı bağlantısı başarılı");
    client.release();
    return true;
  } catch (err) {
    console.error("❌ Veritabanı bağlantı hatası:", err.message);
    console.error("DATABASE_URL formatını kontrol edin (şifre kısmı gizlenmiştir):");
    
    // URL'i güvenli bir şekilde görüntüle (şifreyi maskele)
    if (process.env.DATABASE_URL) {
      const safeUrl = process.env.DATABASE_URL.replace(
        /postgresql:\/\/([^:]+):([^@]+)@/,
        "postgresql://$1:******@"
      );
      console.error(safeUrl);
    }
    
    return false;
  }
}

// Tablo kontrol aracı
export async function checkTables(requiredTables = ["users", "food_logs", "food_items"]) {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const existing = result.rows.map(r => r.table_name);
    const allExist = requiredTables.every(t => existing.includes(t));
    console.error(`📋 Veritabanında mevcut tablolar: ${existing.join(", ")}`);
    return allExist;
  } catch (err) {
    console.error("❌ Tablo kontrol hatası:", err.message);
    return false;
  }
}