import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Veritabanı bağlantısı
import pool from './config/database.js';

// Rotaları import et
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import foodRoutes from './routes/foodRoutes.js';

// Hata middleware'lerini import et
import { errorHandler, notFound } from './middleware/errorMiddleware.js';


// Çevre değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();
const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısını test et
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL veritabanına başarıyla bağlandı');
    client.release();
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    process.exit(1); // Bağlantı hatası durumunda uygulamayı sonlandır
  }
};

testDatabaseConnection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rotaları kullan
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);

// Ana endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Diet Tracker API', 
    version: '1.0.0',
    status: 'Running' 
  });
});

// 404 handler
app.use(notFound);

// Hata yakalama middleware
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

export default app;