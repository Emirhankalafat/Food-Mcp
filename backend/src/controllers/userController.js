import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = 'SELECT id, email, name, gender, weight, height, created_at, api_key FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, gender, weight, height } = req.body;

    const query = `
      UPDATE users 
      SET 
        name = COALESCE($1, name), 
        gender = COALESCE($2, gender),
        weight = COALESCE($3, weight), 
        height = COALESCE($4, height)
      WHERE id = $5
      RETURNING id, email, name, gender, weight, height
    `;

    const values = [name, gender, weight, height, userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({
      message: 'Profil güncellendi',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Mevcut şifreyi kontrol et
    const userQuery = 'SELECT password FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' });
    }
    
    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Şifreyi güncelle
    const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2';
    await pool.query(updateQuery, [hashedPassword, userId]);
    
    res.json({ message: 'Şifre başarıyla değiştirildi' });
    
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    // Şifreyi kontrol et
    const userQuery = 'SELECT password FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Şifre doğrulaması başarısız' });
    }
    
    // Kullanıcının food kayıtlarını sil (cascade ile otomatik silecek şekilde veritabanı ayarlanabilir)
    await pool.query('DELETE FROM food_logs WHERE user_id = $1', [userId]);
    
    // Kullanıcıyı sil
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    
    res.json({ message: 'Hesap başarıyla silindi' });
    
  } catch (error) {
    console.error('Hesap silme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Kullanıcı bilgilerini getir
    const userQuery = 'SELECT id, email, name, gender, weight, height, created_at FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    const user = userResult.rows[0];
    
    // Toplam yemek kayıt istatistikleri
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT fl.id) as total_logs,
        COUNT(fi.id) as total_items,
        SUM(fi.calories) as total_calories,
        AVG(fi.calories) as avg_calories_per_item,
        COUNT(DISTINCT fl.date) as total_days_tracked
      FROM food_logs fl
      LEFT JOIN food_items fi ON fl.id = fi.food_log_id
      WHERE fl.user_id = $1
    `;
    
    const statsResult = await pool.query(statsQuery, [userId]);
    const stats = statsResult.rows[0];
    
    // Boy, kilo bilgileri varsa BMI hesapla
    let bmi = null;
    let bmiCategory = null;
    
    if (user.height && user.weight) {
      // BMI = kilo (kg) / (boy (m) * boy (m))
      const heightInMeters = user.height / 100; // cm'yi metreye çevir
      bmi = user.weight / (heightInMeters * heightInMeters);
      bmi = Math.round(bmi * 10) / 10; // Bir ondalık basamağa yuvarla
      
      // BMI kategorilerini belirle
      if (bmi < 18.5) {
        bmiCategory = 'Zayıf';
      } else if (bmi < 24.9) {
        bmiCategory = 'Normal';
      } else if (bmi < 29.9) {
        bmiCategory = 'Fazla Kilolu';
      } else {
        bmiCategory = 'Obez';
      }
    }
    
    // Kullanıcının kayıt tarihinden bu yana geçen gün sayısı
    const registrationDate = new Date(user.created_at);
    const today = new Date();
    const daysSinceRegistration = Math.floor((today - registrationDate) / (1000 * 60 * 60 * 24));
    
    res.json({
      userInfo: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        registeredDays: daysSinceRegistration
      },
      nutritionStats: {
        totalLogs: parseInt(stats.total_logs) || 0,
        totalItems: parseInt(stats.total_items) || 0,
        totalCalories: parseInt(stats.total_calories) || 0,
        avgCaloriesPerItem: Math.round(stats.avg_calories_per_item) || 0,
        totalDaysTracked: parseInt(stats.total_days_tracked) || 0,
        trackingPercentage: Math.round((stats.total_days_tracked / daysSinceRegistration) * 100) || 0
      },
      healthMetrics: {
        bmi,
        bmiCategory,
        lastUpdated: user.updated_at
      }
    });
    
  } catch (error) {
    console.error('Kullanıcı istatistikleri hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};