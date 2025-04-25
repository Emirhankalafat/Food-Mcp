import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile,
  changePassword,
  deleteAccount,
  getUserStats
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tüm rotalar kimlik doğrulamayı gerektirir
router.use(protect);

// Kullanıcı profili işlemleri
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);
router.get('/stats', getUserStats);

export default router;