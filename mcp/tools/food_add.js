// mcp/tools/food_add.js
import { pool } from "../utils/db.js";

export default {
  name: "food_add",
  description: "Kullanıcının günlük yemek kaydına yeni bir yemek öğesi ekler.",
  inputSchema: {
    type: "object",
    properties: {
      date: {
        type: "string",
        description: "Yemeğin yendiği tarih (YYYY-MM-DD formatında)"
      },
      meal_type: {
        type: "string",
        enum: ["kahvaltı", "öğlen", "akşam", "ara öğün"],
        description: "Öğün tipi (kahvaltı, öğlen, akşam, ara öğün)"
      },
      name: {
        type: "string",
        description: "Yemek adı"
      },
      quantity: {
        type: "number",
        description: "Yemek miktarı"
      },
      unit: {
        type: "string",
        description: "Ölçü birimi (adet, dilim, gram, ml vb.)"
      },
      calories: {
        type: "number",
        description: "Kalori değeri"
      }
    },
    required: ["date", "name", "quantity", "unit", "calories"]
  },
  
  handler: async ({ date, meal_type, name, quantity, unit, calories }) => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY bulunamadı.");
      
      // Kullanıcıyı API key ile tanı
      const userRes = await pool.query(
        "SELECT id FROM users WHERE api_key = $1",
        [apiKey]
      );
      console.error("🧑 Kullanıcı sorgu sonucu:", userRes.rows);
      
      if (!userRes.rows.length) throw new Error("Geçersiz API_KEY");
      const userId = userRes.rows[0].id;
      
      // Varsayılan öğün tipini belirle
      let mealTypeToUse = meal_type;
      if (!mealTypeToUse) {
        const currentHour = new Date().getHours();
        if (currentHour < 11) {
          mealTypeToUse = "kahvaltı";
        } else if (currentHour < 15) {
          mealTypeToUse = "öğlen";
        } else if (currentHour < 20) {
          mealTypeToUse = "akşam";
        } else {
          mealTypeToUse = "ara öğün";
        }
      }
      
      // Aynı gün ve aynı öğün tipi için bir kayıt var mı kontrol et
      let foodLogId;
      const existingLogRes = await pool.query(
        "SELECT id FROM food_logs WHERE user_id = $1 AND date = $2 AND meal_type = $3",
        [userId, date, mealTypeToUse]
      );
      
      if (existingLogRes.rows.length > 0) {
        // Var olan kaydı kullan
        foodLogId = existingLogRes.rows[0].id;
      } else {
        try {
          // Yeni bir food_log kaydı oluştur
          const newLogRes = await pool.query(
            "INSERT INTO food_logs (user_id, date, meal_type) VALUES ($1, $2, $3) RETURNING id",
            [userId, date, mealTypeToUse]
          );
          foodLogId = newLogRes.rows[0].id;
        } catch (insertError) {
          // Duplicate key hatası olursa, tekrar kontrol et (race condition durumları için)
          if (insertError.message.includes('duplicate key')) {
            const retryLogRes = await pool.query(
              "SELECT id FROM food_logs WHERE user_id = $1 AND date = $2 AND meal_type = $3",
              [userId, date, mealTypeToUse]
            );
            if (retryLogRes.rows.length > 0) {
              foodLogId = retryLogRes.rows[0].id;
            } else {
              throw new Error("Günlük kaydı bulunamadı ve oluşturulamadı");
            }
          } else {
            throw insertError; // Başka bir hata ise yukarı ilet
          }
        }
      }
      
      // Yemek öğesini ekle
      const itemRes = await pool.query(
        `INSERT INTO food_items (food_log_id, name, quantity, unit, calories) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [foodLogId, name, quantity, unit, calories]
      );
      
      return {
        content: [
          {
            type: "text",
            text: `✅ ${date} - ${mealTypeToUse} için "${name}" (${quantity} ${unit}, ${calories} kcal) eklendi.`
          }
        ]
      };
    } catch (error) {
      console.error("❌ food_add hatası:", error.message);
      return {
        error: {
          code: -32000,
          message: "Yemek eklenirken hata oluştu",
          data: error.message
        }
      };
    }
  }
};