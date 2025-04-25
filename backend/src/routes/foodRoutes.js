import express from 'express';
import { 
  addFoodEntry, 
  getDailyFoods, 
  getFoodSummary,
  searchFoodItems,
  getFrequentFoods,
  updateFoodItem,
  deleteFoodItem,
  getWeeklyAnalysis
} from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tüm rotalar kimlik doğrulamayı gerektirir
router.use(protect);

// Yemek işlemleri
router.post('/', addFoodEntry);
router.get('/daily', getDailyFoods);
router.get('/summary', getFoodSummary);
router.get('/search', searchFoodItems);
router.get('/frequent', getFrequentFoods);
router.get('/weekly', getWeeklyAnalysis);

// Belirli bir yemek öğesi için işlemler
router.put('/:id', updateFoodItem);
router.delete('/:id', deleteFoodItem);

export default router;