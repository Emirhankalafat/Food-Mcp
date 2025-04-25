import express from 'express';
import { 
  addFoodEntry, 
  getDailyFoods, 
  getFoodSummary 
} from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addFoodEntry);
router.get('/daily', protect, getDailyFoods);
router.get('/summary', protect, getFoodSummary);

export default router;
