// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Sadece Token doğrulayan middleware
export const protect = async (req, res, next) => {
  let token;

  // Authorization header var mı kontrol et
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token'ı ayıkla
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı veritabanında bul
      const query = 'SELECT id, email FROM users WHERE id = $1';
      const { rows } = await pool.query(query, [decoded.id]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
      }

      // Kullanıcıyı request'e ekle
      req.user = rows[0];
      next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error.message);
      res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
    }
  } else {
    res.status(401).json({ message: 'Yetkisiz. Token gerekli.' });
  }
};
