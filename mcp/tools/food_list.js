// mcp/tools/food_list.js
import { pool } from "../utils/db.js";

export default {
  name: "food_list",
  description: "Kullanıcının belirli bir gün veya tarih aralığındaki yemek kayıtlarını listeler.",
  inputSchema: {
    type: "object",
    properties: {
      date: {
        type: "string",
        description: "Listelenecek tarih (YYYY-MM-DD formatında), belirtilmezse bugün kabul edilir"
      },
      meal_type: {
        type: "string",
        enum: ["kahvaltı", "öğlen", "akşam", "ara öğün"],
        description: "Listelenecek öğün tipi (boş bırakılırsa tüm öğünler listelenir)"
      },
      start_date: {
        type: "string",
        description: "Tarih aralığının başlangıcı (YYYY-MM-DD formatında)"
      },
      end_date: {
        type: "string",
        description: "Tarih aralığının sonu (YYYY-MM-DD formatında)"
      }
    }
  },

  handler: async ({ date, meal_type, start_date, end_date }) => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY bulunamadı.");

      const userRes = await pool.query(
        "SELECT id FROM users WHERE api_key = $1",
        [apiKey]
      );
      if (!userRes.rows.length) throw new Error("Geçersiz API_KEY");
      const userId = userRes.rows[0].id;

      let responseText = "";

      // Eğer tek bir gün sorgulanıyorsa
      if (date) {
        let query = `
          SELECT l.date, l.meal_type, i.name, i.quantity, i.unit, i.calories
          FROM food_logs l
          JOIN food_items i ON l.id = i.food_log_id
          WHERE l.user_id = $1 AND l.date = $2
        `;
        const params = [userId, date];

        if (meal_type) {
          query += " AND l.meal_type = $3";
          params.push(meal_type);
        }

        query += " ORDER BY l.meal_type, i.created_at";

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
          responseText = meal_type
            ? `📅 ${date} tarihinde "${meal_type}" öğününde kaydedilmiş yemek bulunamadı.`
            : `📅 ${date} tarihinde kaydedilmiş yemek bulunamadı.`;
        } else {
          const meals = {};
          let totalCalories = 0;

          result.rows.forEach(row => {
            if (!meals[row.meal_type]) {
              meals[row.meal_type] = { items: [], total: 0 };
            }
            meals[row.meal_type].items.push({
              name: row.name,
              quantity: row.quantity,
              unit: row.unit,
              calories: row.calories
            });
            meals[row.meal_type].total += Number(row.calories);
            totalCalories += Number(row.calories);
          });

          responseText = `📋 ${date} Tarihli`;
          responseText += meal_type ? ` ${meal_type} ` : " ";
          responseText += `Yemek Listeniz (Toplam: ${totalCalories} kalori)\n\n`;

          for (const mealType in meals) {
            responseText += `🍽️ ${mealType.toUpperCase()} (${meals[mealType].total} kalori):\n`;
            meals[mealType].items.forEach(item => {
              responseText += `   • ${item.name}: ${item.quantity} ${item.unit} (${item.calories} kalori)\n`;
            });
            responseText += '\n';
          }
        }

      } else if (start_date && end_date) {
        // Tarih aralığı sorgulanıyorsa
        const result = await pool.query(
          `SELECT l.date, l.meal_type, SUM(i.calories) as total_calories, COUNT(i.id) as item_count
           FROM food_logs l
           JOIN food_items i ON l.id = i.food_log_id
           WHERE l.user_id = $1 AND l.date BETWEEN $2 AND $3
           GROUP BY l.date, l.meal_type
           ORDER BY l.date, l.meal_type`,
          [userId, start_date, end_date]
        );

        if (result.rows.length === 0) {
          responseText = `📅 ${start_date} ile ${end_date} tarihleri arasında kaydedilmiş yemek bulunamadı.`;
        } else {
          const days = {};
          let grandTotal = 0;

          result.rows.forEach(row => {
            if (!days[row.date]) {
              days[row.date] = { meals: {}, daily_total: 0 };
            }
            days[row.date].meals[row.meal_type] = {
              total_calories: Number(row.total_calories),
              item_count: Number(row.item_count)
            };
            days[row.date].daily_total += Number(row.total_calories);
            grandTotal += Number(row.total_calories);
          });

          responseText = `📊 ${start_date} - ${end_date} Tarih Aralığındaki Yemek Özeti\n\n`;
          responseText += `Toplam Kalori: ${grandTotal} kalori\n`;
          responseText += `Ortalama Günlük Kalori: ${Math.round(grandTotal / Object.keys(days).length)} kalori\n\n`;

          Object.keys(days).sort().forEach(date => {
            responseText += `📆 ${date} (${days[date].daily_total} kalori):\n`;
            for (const mealType in days[date].meals) {
              const meal = days[date].meals[mealType];
              responseText += `   • ${mealType}: ${meal.total_calories} kalori (${meal.item_count} yemek)\n`;
            }
            responseText += '\n';
          });
        }
      } else {
        responseText = "📅 Lütfen bir tarih veya tarih aralığı belirtin.";
      }

      // ✅ Claude uyumlu dönüş formatı
      return {
        content: [
          {
            type: "text",
            text: responseText
          }
        ]
      };

    } catch (error) {
      console.error("❌ food_list hatası:", error.message);
      return {
        error: {
          code: -32000,
          message: "Yemek listesi alınırken hata oluştu",
          data: error.message
        }
      };
    }
  }
};
