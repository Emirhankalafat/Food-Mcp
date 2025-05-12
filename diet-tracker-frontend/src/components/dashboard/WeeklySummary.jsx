// src/components/dashboard/WeeklySummary.jsx
import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const WeeklySummary = ({ data }) => {
  if (!data || !data.stats) {
    return (
      <div className="weekly-summary">
        <h2>Haftalık Özet</h2>
        <p>Haftalık veri bulunmuyor.</p>
      </div>
    );
  }

  const { period, stats } = data;
  const formattedStartDate = format(new Date(period.startDate), 'd MMMM', { locale: tr });
  const formattedEndDate = format(new Date(period.endDate), 'd MMMM', { locale: tr });

  return (
    <div className="weekly-summary">
      <h2>Haftalık Özet</h2>
      <div className="summary-period">
        {formattedStartDate} - {formattedEndDate}
      </div>
      
      <div className="summary-content">
        <div className="summary-stat">
          <span className="label">Toplam Kalori</span>
          <span className="value">{stats.totalCalories}</span>
        </div>
        
        <div className="summary-stat">
          <span className="label">Günlük Ortalama</span>
          <span className="value">{stats.averageCalories}</span>
        </div>
        
        <div className="summary-stat">
          <span className="label">En Yüksek</span>
          <span className="value">{stats.maxCalories}</span>
        </div>
        
        <div className="summary-stat">
          <span className="label">En Düşük</span>
          <span className="value">{stats.minCalories > 0 ? stats.minCalories : 'N/A'}</span>
        </div>
        
        <div className="summary-stat">
          <span className="label">Takip Edilen Gün</span>
          <span className="value">{stats.daysTracked} / 7</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;