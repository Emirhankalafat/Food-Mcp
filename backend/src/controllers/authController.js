// Gerekli modülleri import ediyoruz
import pool from '../config/database.js';  // Veritabanı bağlantısı
import bcrypt from 'bcryptjs';  // Şifre hashleme
import jwt from 'jsonwebtoken';  // JWT token oluşturma
import crypto from 'crypto';  // Rastgele API anahtarı oluşturma

// API anahtarı oluşturma fonksiyonu
const generateApiKey = () => {
  // 64 karakter sınırına uymak için 32 byte (64 hex karakter) oluşturuyoruz
  return crypto.randomBytes(32).toString('hex');
};

// Kullanıcı kaydı fonksiyonu
export const register = async (req, res) => {
  try {
    // Request body'den verileri alıyoruz
    const { email, password, name, gender, weight, height } = req.body;

    // Email adresiyle kayıtlı kullanıcı var mı kontrol ediyoruz
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    // Eğer varsa hata döndürüyoruz
    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ message: 'Bu email zaten kullanımda' });
    }

    // Şifreyi hashliyoruz
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // API anahtarı oluşturuyoruz
    const api_key = generateApiKey();

    // Kullanıcıyı veritabanına ekliyoruz
    const insertQuery = `
      INSERT INTO users 
      (email, password, name, gender, weight, height, api_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, name, api_key
    `;

    const values = [email, hashedPassword, name, gender, weight, height, api_key];
    const result = await pool.query(insertQuery, values);
    const newUser = result.rows[0];

    // JWT token oluşturuyoruz
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Başarılı yanıt döndürüyoruz
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

// Login fonksiyonu
export const login = async (req, res) => {
  try {
    // Email ve şifreyi alıyoruz
    const { email, password } = req.body;

    // Kullanıcıyı email ile arıyoruz
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    // Kullanıcı yoksa hata döndürüyoruz
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    const user = result.rows[0];

    // Şifreyi kontrol ediyoruz
    const isMatch = await bcrypt.compare(password, user.password);

    // Şifre yanlışsa hata döndürüyoruz
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }

    // JWT token oluşturuyoruz
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Şifreyi yanıttan çıkarıyoruz
    delete user.password;

    // Başarılı yanıt döndürüyoruz
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

// API anahtarını yenileme fonksiyonu
export const regenerateApiKey = async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware'inden gelen kullanıcı ID'si
    
    // Yeni API anahtarı oluşturuyoruz
    const newApiKey = generateApiKey();
    
    // Veritabanında güncelliyoruz
    const updateQuery = 'UPDATE users SET api_key = $1 WHERE id = $2 RETURNING id, email, name, api_key';
    const result = await pool.query(updateQuery, [newApiKey, userId]);
    
    // Kullanıcı yoksa hata döndürüyoruz
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Başarılı yanıt döndürüyoruz
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