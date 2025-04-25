import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      gender, 
      weight, 
      height 
    } = req.body;

    // Kullanıcı var mı kontrolü
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Bu email zaten kullanımda' 
      });
    }

    // Şifre hashleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kullanıcı ekleme
    const insertQuery = `
      INSERT INTO users 
      (email, password, name, gender, weight, height) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;

    const values = [
      email, 
      hashedPassword, 
      name, 
      gender, 
      weight, 
      height
    ];

    const result = await pool.query(insertQuery, values);
    const newUser = result.rows[0];

    // JWT token oluştur
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Şifreyi yanıttan çıkar
    delete newUser.password;

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    const user = result.rows[0];

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Şifreyi yanıttan çıkar
    delete user.password;

    res.json({
      message: 'Giriş başarılı',
      user,
      token
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = 'SELECT id, email, name, gender, weight, height FROM users WHERE id = $1';
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
    const { name, weight, height } = req.body;

    const query = `
      UPDATE users 
      SET 
        name = COALESCE($1, name), 
        weight = COALESCE($2, weight), 
        height = COALESCE($3, height)
      WHERE id = $4
      RETURNING id, email, name, gender, weight, height
    `;

    const values = [name, weight, height, userId];

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
