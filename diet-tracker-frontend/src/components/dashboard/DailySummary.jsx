// src/components/dashboard/DailySummary.jsx
import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const DailySummary = ({ data }) => {
  if (!data || !data.meals) {
    return (
      <div className="daily-summary">
        <h2>Bugünkü Özet</h2>
        <p>Bugün için veri bulunmuyor.</p>
      </div>
    );
  }

  const today = format(new Date(), 'EEEE, d MMMM yyyy', { locale: tr });
  const { totalCalories, meals } = data;

  // Toplam besin sayısını hesapla
  const totalFoodItems = Object.values(meals).reduce(
    (sum, meal) => sum + meal.items.length, 0
  );

  return (
    <div className="daily-summary">
      <h2>Günlük Özet</h2>
      <div className="summary-date">{today}</div>
      
      <div className="summary-content">
        <div className="summary-stat">
          <span className="label">Toplam Kalori</span>
          <span className="value">{totalCalories}</span>
        </div>
        
        <div className="summary-stat">
          <span className="label">Besin Sayısı</span>
          <span className="value">{totalFoodItems}</span>
        </div>
        
        <div className="summary-meal-distribution">
          <h3>Öğün Dağılımı</h3>
          {Object.keys(meals).map(mealType => (
            <div key={mealType} className="meal-stat">
              <span className="meal-name">
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </span>
              <span className="meal-calories">
                {meals[mealType].mealCalories} kalori
              </span>
              <span className="meal-item-count">
                {meals[mealType].items.length} besin
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailySummary;