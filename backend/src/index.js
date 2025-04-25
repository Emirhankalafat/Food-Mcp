import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Veritabanı bağlantısını test etmek için
import { testDatabaseConnection } from './config/database.js';

// Rotaları import et
// import userRoutes from './routes/userRoutes.js';
// import foodRoutes from './routes/foodRoutes.js';

// Çevre değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Veritabanı bağlantısını test et
testDatabaseConnection();

// Rotaları kullan
// app.use('/api/users', userRoutes);
// app.use('/api/foods', foodRoutes);

// Temel endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Diet Tracker API', 
    status: 'Running' 
  });
});

// Hata yakalama middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Bir hata oluştu', 
    error: err.message 
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

export default app;
