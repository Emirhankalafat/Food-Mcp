import pool from '../config/database.js';

export const addFoodEntry = async (req, res) => {
  try {
    const { 
      name, 
      calories, 
      quantity, 
      unit, 
      mealType, 
      date 
    } = req.body;
    const userId = req.user.id;

    // Günlük log kontrolü ve oluşturma
    let foodLogId;
    const existingLogQuery = `
      SELECT id FROM food_logs 
      WHERE user_id = $1 AND date = $2 AND meal_type = $3
    `;
    const existingLogResult = await pool.query(existingLogQuery, [
      userId, 
      date, 
      mealType
    ]);

    if (existingLogResult.rows.length > 0) {
      foodLogId = existingLogResult.rows[0].id;
    } else {
      const newLogQuery = `
        INSERT INTO food_logs (user_id, date, meal_type) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `;
      const newLogResult = await pool.query(newLogQuery, [
        userId, 
        date, 
        mealType
      ]);
      foodLogId = newLogResult.rows[0].id;
    }

    // Besin girişi
    const foodEntryQuery = `
      INSERT INTO food_items 
      (food_log_id, name, quantity, unit, calories) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const foodEntryResult = await pool.query(foodEntryQuery, [
      foodLogId,
      name,
      quantity,
      unit,
      calories
    ]);

    res.status(201).json({
      message: 'Besin girişi başarıyla eklendi',
      food: foodEntryResult.rows[0]
    });
  } catch (error) {
    console.error('Besin girişi hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const getDailyFoods = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const query = `
      SELECT fi.* 
      FROM food_items fi
      JOIN food_logs fl ON fi.food_log_id = fl.id
      WHERE fl.user_id = $1 AND fl.date = $2
      ORDER BY fi.created_at
    `;

    const result = await pool.query(query, [userId, date]);

    const totalCalories = result.rows.reduce((sum, food) => sum + food.calories, 0);

    res.json({
      foods: result.rows,
      totalCalories
    });
  } catch (error) {
    console.error('Günlük besinler getirme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const getFoodSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const query = `
      SELECT 
        fl.date, 
        fl.meal_type,
        SUM(fi.calories) as total_calories,
        COUNT(fi.id) as item_count
      FROM food_logs fl
      JOIN food_items fi ON fl.id = fi.food_log_id
      WHERE fl.user_id = $1 AND fl.date BETWEEN $2 AND $3
      GROUP BY fl.date, fl.meal_type
      ORDER BY fl.date, fl.meal_type
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);

    // Toplam ve ortalama hesaplamaları
    const totalCalories = result.rows.reduce((sum, row) => sum + row.total_calories, 0);
    const dayCount = new Set(result.rows.map(row => row.date)).size;
    const averageCalories = dayCount > 0 ? Math.round(totalCalories / dayCount) : 0;

    res.json({
      summary: result.rows,
      totalCalories,
      averageCalories,
      dayCount
    });
  } catch (error) {
    console.error('Besin özeti getirme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};
