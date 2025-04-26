import pool from '../config/database.js';

// ➔ Besin Ekle
export const addFoodEntry = async (req, res) => {
  try {
    const { name, calories, quantity, unit, mealType, date } = req.body;
    const userId = req.user.id;

    let foodLogId;
    const existingLog = await pool.query(
      `SELECT id FROM food_logs WHERE user_id = $1 AND date = $2 AND meal_type = $3`,
      [userId, date, mealType]
    );

    if (existingLog.rows.length > 0) {
      foodLogId = existingLog.rows[0].id;
    } else {
      const newLog = await pool.query(
        `INSERT INTO food_logs (user_id, date, meal_type) VALUES ($1, $2, $3) RETURNING id`,
        [userId, date, mealType]
      );
      foodLogId = newLog.rows[0].id;
    }

    const foodEntry = await pool.query(
      `INSERT INTO food_items (food_log_id, name, quantity, unit, calories) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [foodLogId, name, quantity, unit, calories]
    );

    res.status(201).json({ message: 'Besin girişi başarıyla eklendi', food: foodEntry.rows[0] });
  } catch (error) {
    console.error('Besin girişi hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Günlük Besinleri Getir
export const getDailyFoods = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, mealType } = req.query;

    let query = `
      SELECT fi.*, fl.meal_type
      FROM food_items fi
      JOIN food_logs fl ON fi.food_log_id = fl.id
      WHERE fl.user_id = $1 AND fl.date = $2
    `;
    const queryParams = [userId, date];

    if (mealType) {
      query += ` AND fl.meal_type = $3`;
      queryParams.push(mealType);
    }

    query += ` ORDER BY fl.meal_type, fi.created_at`;

    const result = await pool.query(query, queryParams);

    const mealGroups = {};
    let totalCalories = 0;

    result.rows.forEach(food => {
      if (!mealGroups[food.meal_type]) {
        mealGroups[food.meal_type] = { items: [], mealCalories: 0 };
      }
      mealGroups[food.meal_type].items.push(food);
      mealGroups[food.meal_type].mealCalories += Number(food.calories);
      totalCalories += Number(food.calories);
    });

    res.json({ date, meals: mealGroups, totalCalories });
  } catch (error) {
    console.error('Günlük besinler getirme hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Besin Özeti Getir (Tarih Aralığı)
export const getFoodSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const result = await pool.query(`
      SELECT fl.date, fl.meal_type, SUM(fi.calories) as total_calories, COUNT(fi.id) as item_count
      FROM food_logs fl
      JOIN food_items fi ON fl.id = fi.food_log_id
      WHERE fl.user_id = $1 AND fl.date BETWEEN $2 AND $3
      GROUP BY fl.date, fl.meal_type
      ORDER BY fl.date, fl.meal_type
    `, [userId, startDate, endDate]);

    const totalCalories = result.rows.reduce((sum, row) => sum + parseInt(row.total_calories), 0);
    const dayCount = new Set(result.rows.map(row => row.date)).size;
    const averageCalories = dayCount > 0 ? Math.round(totalCalories / dayCount) : 0;

    const mealTypeDistribution = {};
    const mealTypeAverages = {};

    result.rows.forEach(row => {
      mealTypeDistribution[row.meal_type] = (mealTypeDistribution[row.meal_type] || 0) + parseInt(row.total_calories);
    });

    for (const mealType in mealTypeDistribution) {
      const count = result.rows.filter(row => row.meal_type === mealType).length;
      mealTypeAverages[mealType] = Math.round(mealTypeDistribution[mealType] / count);
    }

    res.json({
      period: { startDate, endDate, dayCount },
      calories: {
        total: totalCalories,
        daily: {
          average: averageCalories,
          highest: Math.max(...result.rows.map(row => parseInt(row.total_calories))),
          lowest: Math.min(...result.rows.map(row => parseInt(row.total_calories)))
        }
      },
      mealTypes: {
        distribution: mealTypeDistribution,
        averages: mealTypeAverages
      },
      dailyBreakdown: result.rows
    });
  } catch (error) {
    console.error('Besin özeti getirme hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Besin Arama
export const searchFoodItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Arama sorgusu en az 2 karakter olmalıdır' });
    }

    const result = await pool.query(`
      SELECT fi.*, fl.date, fl.meal_type 
      FROM food_items fi
      JOIN food_logs fl ON fi.food_log_id = fl.id
      WHERE fl.user_id = $1 AND fi.name ILIKE $2
      ORDER BY fl.date DESC, fi.name
      LIMIT 50
    `, [userId, `%${query}%`]);

    res.json({ results: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Besin arama hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Sık Kullanılan Besinler
export const getFrequentFoods = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const result = await pool.query(`
      SELECT fi.name, COUNT(*) as frequency, AVG(fi.calories) as avg_calories, AVG(fi.quantity) as avg_quantity, fi.unit
      FROM food_items fi
      JOIN food_logs fl ON fi.food_log_id = fl.id
      WHERE fl.user_id = $1
      GROUP BY fi.name, fi.unit
      ORDER BY frequency DESC
      LIMIT $2
    `, [userId, limit]);

    res.json({ frequentFoods: result.rows });
  } catch (error) {
    console.error('Sık tüketilen besinler hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Besin Güncelle
export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, calories, quantity, unit } = req.body;
    const userId = req.user.id;

    const check = await pool.query(`
      SELECT fi.id FROM food_items fi
      JOIN food_logs fl ON fi.food_log_id = fl.id
      WHERE fi.id = $1 AND fl.user_id = $2
    `, [id, userId]);

    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Besin bulunamadı veya yetkiniz yok' });
    }

    const result = await pool.query(`
      UPDATE food_items
      SET name = COALESCE($1, name),
          calories = COALESCE($2, calories),
          quantity = COALESCE($3, quantity),
          unit = COALESCE($4, unit)
      WHERE id = $5
      RETURNING *
    `, [name, calories, quantity, unit, id]);

    res.json({ message: 'Besin güncellendi', food: result.rows[0] });
  } catch (error) {
    console.error('Besin güncelleme hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Besin Sil
export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const check = await pool.query(`
      SELECT fi.id FROM food_items fi
      JOIN food_logs fl ON fi.food_log_id = fl.id
      WHERE fi.id = $1 AND fl.user_id = $2
    `, [id, userId]);

    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Besin bulunamadı veya yetkiniz yok' });
    }

    await pool.query(`DELETE FROM food_items WHERE id = $1`, [id]);
    res.json({ message: 'Besin silindi', id });
  } catch (error) {
    console.error('Besin silme hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Haftalık Analiz
export const getWeeklyAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate } = req.query;

    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + 6);
    const endDate = endDateObj.toISOString().split('T')[0];

    const result = await pool.query(`
      SELECT fl.date, SUM(fi.calories) as daily_calories
      FROM food_logs fl
      JOIN food_items fi ON fi.food_log_id = fl.id
      WHERE fl.user_id = $1 AND fl.date BETWEEN $2 AND $3
      GROUP BY fl.date
      ORDER BY fl.date
    `, [userId, startDate, endDate]);

    const dailyData = {};
    let currentDate = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyData[dateStr] = { date: dateStr, calories: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    result.rows.forEach(row => {
      if (dailyData[row.date]) {
        dailyData[row.date].calories = parseInt(row.daily_calories);
      }
    });

    const caloriesArray = Object.values(dailyData).map(day => day.calories);
    const totalCalories = caloriesArray.reduce((sum, cal) => sum + cal, 0);
    const avgCalories = Math.round(totalCalories / 7);
    const maxCalories = Math.max(...caloriesArray);
    const minCalories = Math.min(...caloriesArray.filter(cal => cal > 0)) || 0;

    res.json({
      period: { startDate, endDate, weekNumber: getWeekNumber(new Date(startDate)) },
      stats: { totalCalories, averageCalories: avgCalories, maxCalories, minCalories, daysTracked: caloriesArray.filter(c => c > 0).length },
      dailyData: Object.values(dailyData)
    });

  } catch (error) {
    console.error('Haftalık analiz hatası:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// ➔ Yardımcı: Hafta Numarası Hesabı
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
