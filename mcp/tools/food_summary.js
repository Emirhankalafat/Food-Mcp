// mcp/tools/food_summary.js
import { pool } from "../utils/db.js";

export default {
  name: "food_summary",
  description: "Belirli bir tarih aralığındaki yemek kayıtlarını analiz eder ve beslenme özeti verir.",
  inputSchema: {
    type: "object",
    properties: {
      start_date: { 
        type: "string", 
        description: "Başlangıç tarihi (YYYY-MM-DD)" 
      },
      end_date: { 
        type: "string", 
        description: "Bitiş tarihi (YYYY-MM-DD)" 
      }
    },
    required: ["start_date", "end_date"]
  },
  handler: async ({ start_date, end_date }) => {
    let client;
    try {
      // Tarih formatı doğrulama
      if (!isValidDate(start_date) || !isValidDate(end_date)) {
        throw new Error("Geçersiz tarih formatı. Lütfen YYYY-MM-DD formatında tarih girin.");
      }
      
      // Tarih aralığı kontrolü
      const startDt = new Date(start_date);
      const endDt = new Date(end_date);
      if (startDt > endDt) {
        throw new Error("Başlangıç tarihi bitiş tarihinden sonra olamaz.");
      }
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY bulunamadı.");
      
      // Client bağlantısı al
      client = await pool.connect();
      
      // Kullanıcıyı API key ile tanı
      const userResult = await client.query(
        "SELECT id, name FROM users WHERE api_key = $1", 
        [apiKey]
      );
      
      if (!userResult.rows.length) throw new Error("Geçersiz API_KEY");
      const userId = userResult.rows[0].id;
      const userName = userResult.rows[0].name || "Kullanıcı";
      
      // Belirtilen tarih aralığındaki yemek verilerini al
      const mealsQuery = await client.query(
        `SELECT l.date, l.meal_type, SUM(i.calories) as total_calories,
         COUNT(i.id) as item_count
         FROM food_logs l
         JOIN food_items i ON l.id = i.food_log_id
         WHERE l.user_id = $1 AND l.date BETWEEN $2 AND $3
         GROUP BY l.date, l.meal_type
         ORDER BY l.date, l.meal_type`,
        [userId, start_date, end_date]
      );
      
      // Veri yoksa hata döndür
      if (mealsQuery.rows.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `📅 ${start_date} ile ${end_date} tarihleri arasında kayıtlı veri bulunamadı.`
            }
          ]
        };
      }
      
      // Sonuçları yapılandır
      const daysData = {};
      let totalCalories = 0;
      
      mealsQuery.rows.forEach(row => {
        if (!daysData[row.date]) {
          daysData[row.date] = {
            total: 0,
            meals: {}
          };
        }
        
        daysData[row.date].meals[row.meal_type] = {
          calories: Number(row.total_calories),
          item_count: Number(row.item_count)
        };
        
        daysData[row.date].total += Number(row.total_calories);
        totalCalories += Number(row.total_calories);
      });
      
      // Kaç gün veri var
      const dayCount = Object.keys(daysData).length;
      
      // Günlük ortalama kalori
      const avgCalories = Math.round(totalCalories / dayCount);
      
      // En yüksek ve en düşük kalorili günler
      const daysArray = Object.entries(daysData).map(([date, data]) => ({
        date,
        calories: data.total
      }));
      
      const highestDay = daysArray.reduce((max, current) => 
        current.calories > max.calories ? current : max
      , {calories: 0});
      
      const lowestDay = daysArray.reduce((min, current) => 
        current.calories < min.calories || min.calories === 0 ? current : min
      , {calories: 0});
      
      // Öğün tipine göre toplam kalori
      const mealTypeCalories = {
        "kahvaltı": 0,
        "öğlen": 0,
        "akşam": 0,
        "ara öğün": 0
      };
      
      mealsQuery.rows.forEach(row => {
        if (mealTypeCalories[row.meal_type] !== undefined) {
          mealTypeCalories[row.meal_type] += Number(row.total_calories);
        }
      });
      
      // Cevap metnini oluştur
      let responseText = `📊 ${start_date} - ${end_date} Tarihleri Arası Beslenme Özeti\n\n`;
      
      responseText += `📅 Veri Olan Gün Sayısı: ${dayCount} gün\n`;
      responseText += `🔥 Toplam Kalori: ${totalCalories} kalori\n`;
      responseText += `📈 Günlük Ortalama: ${avgCalories} kalori\n\n`;
      
      responseText += `📆 En Yüksek Kalorili Gün: ${highestDay.date} (${highestDay.calories} kalori)\n`;
      responseText += `📆 En Düşük Kalorili Gün: ${lowestDay.date} (${lowestDay.calories} kalori)\n\n`;
      
      responseText += `🍳 Öğünlere Göre Dağılım:\n`;
      
      for (const [mealType, calories] of Object.entries(mealTypeCalories)) {
        if (calories > 0) {
          const percentage = Math.round((calories / totalCalories) * 100);
          responseText += `   • ${mealType}: ${calories} kalori (${percentage}%)\n`;
        }
      }
      
      responseText += `\n📅 Günlük Özet:\n`;
      
      Object.keys(daysData).sort().forEach(date => {
        responseText += `   • ${date}: ${daysData[date].total} kalori\n`;
        
        // Her öğünün kalorisini göster
        for (const [mealType, data] of Object.entries(daysData[date].meals)) {
          responseText += `     - ${mealType}: ${data.calories} kalori (${data.item_count} öğe)\n`;
        }
        
        responseText += '\n';
      });
      
      // Claude uyumlu yanıt formatı
      return {
        content: [
          {
            type: "text",
            text: responseText
          }
        ]
      };
      
    } catch (error) {
      console.error("❌ Özet oluşturma hatası:", error.message || "Bilinmeyen hata");
      return {
        error: {
          code: -32000,
          message: "Beslenme özeti oluşturulurken hata oluştu",
          data: error.message || "Bilinmeyen hata"
        }
      };
    } finally {
      // Client'ı serbest bırak
      if (client) {
        client.release();
      }
    }
  }
};

// Tarih formatı doğrulama yardımcı fonksiyonu
function isValidDate(dateString) {
  if (!dateString) return false;
  
  // YYYY-MM-DD formatına uygunluk kontrolü
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  // Geçerli tarih kontrolü
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && 
         date.toISOString().slice(0, 10) === dateString;
}