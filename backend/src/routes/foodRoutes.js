import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

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

const router = express.Router();

// ➔ Tüm rotalar koruma altında (token zorunlu)
router.use(protect);

// ➔ Yemek işlemleri
router.post('/', addFoodEntry);
router.get('/daily', getDailyFoods);
router.get('/summary', getFoodSummary);
router.get('/search', searchFoodItems);
router.get('/frequent', getFrequentFoods);
router.get('/weekly', getWeeklyAnalysis);

// ➔ Belirli bir besin öğesi işlemleri
router.put('/:id', updateFoodItem);
router.delete('/:id', deleteFoodItem);

export default router;
