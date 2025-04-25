import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Token doğrulama middleware
export const protect = async (req, res, next) => {
  let token;

  // Token kontrolü
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı ayıkla
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcı bilgilerini sorgula
      const query = 'SELECT id, email FROM users WHERE id = $1';
      const result = await pool.query(query, [decoded.id]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Yetkisiz erişim' });
      }

      // Kullanıcı bilgilerini requeste ekle
      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      res.status(401).json({ 
        message: 'Yetkisiz erişim', 
        error: error.message 
      });
    }
  }

  // Token yoksa
  if (!token) {
    res.status(401).json({ message: 'Token bulunamadı' });
  }
};

// API key doğrulama middleware
export const protectApiKey = async (req, res, next) => {
  const apiKey = req.get('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({ message: 'API Key gerekli' });
  }

  try {
    // API key kontrolü
    const query = 'SELECT * FROM users WHERE api_key = $1';
    const result = await pool.query(query, [apiKey]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Geçersiz API Key' });
    }

    // Kullanıcı bilgilerini requeste ekle
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('API Key doğrulama hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası', 
      error: error.message 
    });
  }
};

// İsteği sınırlama middleware (Rate limiting)
export const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Temizlik yap - eski kayıtları sil
    for (const [key, time] of requests.entries()) {
      if (time < windowStart) {
        requests.delete(key);
      }
    }

    // İstek sayısını kontrol et
    const userRequests = requests.get(ip) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= limit) {
      return res.status(429).json({ 
        message: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' 
      });
    }

    // İstek sayısını güncelle
    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
};

// Rol bazlı yetkilendirme middleware (gelecekte kullanılabilir)
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        message: 'Yetkilendirme hatası: Kullanıcı rolü bulunamadı' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Bu işlemi yapmaya yetkiniz yok' 
      });
    }
    
    next();
  };
};