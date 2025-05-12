// src/components/food/FoodList.jsx
import React from 'react';
import FoodItem from './FoodItem';

const FoodList = ({ foods, onFoodDeleted }) => {
  // Öğünlere göre grupla
  const groupByMealType = () => {
    if (!foods || !foods.meals) return {};
    return foods.meals;
  };
  
  const mealGroups = groupByMealType();
  const mealTypes = Object.keys(mealGroups);
  
  if (mealTypes.length === 0) {
    return (
      <div className="food-list-empty">
        <p>Bu tarih için kayıtlı besin bulunmamaktadır.</p>
      </div>
    );
  }
  
  return (
    <div className="food-list-container">
      <div className="total-calories">
        <h3>Toplam Kalori: {foods.totalCalories}</h3>
      </div>
      
      {mealTypes.map((mealType) => (
        <div key={mealType} className="meal-section">
          <h3 className="meal-title">
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            <span className="meal-calories">
              {mealGroups[mealType].mealCalories} kcal
            </span>
          </h3>
          
          <div className="food-items">
            {mealGroups[mealType].items.map((food) => (
              <FoodItem 
                key={food.id} 
                food={food} 
                onDeleted={onFoodDeleted} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList;