import express from 'express';
import { 
  register, 
  login,
  regenerateApiKey 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temel auth işlemleri
router.post('/register', register);
router.post('/login', login);

// API anahtarı yenileme - kullanıcının giriş yapmış olmasını gerektiriyor
router.post('/regenerate-api-key', protect, regenerateApiKey);

export default router;