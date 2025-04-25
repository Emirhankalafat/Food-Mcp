import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// API anahtarı oluşturma fonksiyonu
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      gender,
      weight,
      height
    } = req.body;

    // Email kontrolü
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

    // API anahtarı oluştur
    const apikey = generateApiKey();

    // Kullanıcı ekleme
    const insertQuery = `
      INSERT INTO users 
      (email, password, name, gender, weight, height, apikey)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, name, apikey
    `;

    const values = [
      email,
      hashedPassword,
      name,
      gender,
      weight,
      height,
      apikey
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
      { expiresIn: '30d' }
    );

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

export const login = async (req, res) => {
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
      { expiresIn: '30d' }
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

// API anahtarını yeniden oluşturmak için endpoint (isteğe bağlı)
export const regenerateApiKey = async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware'inden gelen kullanıcı ID'si
    
    // Yeni API anahtarı oluştur
    const newApiKey = generateApiKey();
    
    // Veritabanında güncelle
    const updateQuery = 'UPDATE users SET apikey = $1 WHERE id = $2 RETURNING id, email, name, apikey';
    const result = await pool.query(updateQuery, [newApiKey, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    res.json({
      message: 'API anahtarı başarıyla yenilendi',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('API anahtarı yenileme hatası:', error);
    res.status(500).json({
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};