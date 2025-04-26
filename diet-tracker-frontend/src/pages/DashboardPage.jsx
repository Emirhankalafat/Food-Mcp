// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/DashboardPage.css';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import DailySummary from '../components/dashboard/DailySummary';
import WeeklySummary from '../components/dashboard/WeeklySummary';
import CalorieChart from '../components/charts/CalorieChart';
import MealDistributionChart from '../components/charts/MealDistributionChart';
import { getDailyFoods, getWeeklyAnalysis, getFoodSummary } from '../api/foodService';
import { FaChartBar, FaUtensils, FaCalendarAlt } from 'react-icons/fa';

const DashboardPage = () => {
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [mealDistribution, setMealDistribution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const weekStartDate = format(subDays(new Date(), 6), 'yyyy-MM-dd');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Bugünün besin verilerini al
        const dailyResult = await getDailyFoods(today);
        setDailyData(dailyResult);
        
        // Haftalık analiz verisini al
        const weeklyResult = await getWeeklyAnalysis(weekStartDate);
        console.log('Haftalık Veri:', weeklyResult); // Veriyi kontrol et
        setWeeklyData(weeklyResult);
        
        // Öğün dağılımı için haftalık özet al
        const summaryResult = await getFoodSummary(weekStartDate, today);
        if (summaryResult && summaryResult.mealTypes && summaryResult.mealTypes.distribution) {
          setMealDistribution(summaryResult.mealTypes.distribution);
        }
      } catch (err) {
        console.error('Veri getirme hatası:', err);
        setError('Veriler alınırken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [today, weekStartDate]);
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Veriler yükleniyor...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Hata Oluştu</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Yeniden Dene</button>
        </div>
      </div>
    );
  }
  
  const formattedDate = format(new Date(), 'd MMMM yyyy, EEEE', { locale: tr });
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <FaChartBar className="icon-header" /> Beslenme Takip Paneli
        </h1>
        <p className="current-date">
          <FaCalendarAlt /> {formattedDate}
        </p>
      </div>
      
      <div className="dashboard-summary">
        <DailySummary data={dailyData} />
        <WeeklySummary data={weeklyData} />
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-row">
          <div className="chart-column">
            <div className="chart-card">
              <h2><FaChartBar /> Haftalık Kalori Alımı</h2>
              {weeklyData && <CalorieChart data={weeklyData.dailyData} />}
            </div>
          </div>
          <div className="chart-column">
            <div className="chart-card">
              <h2><FaUtensils /> Öğün Dağılımı</h2>
              {mealDistribution && <MealDistributionChart data={mealDistribution} />}
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-quick-add">
        <h2>Hızlı İşlemler</h2>
        <div className="quick-actions">
          <button onClick={() => window.location.href = '/food-journal'} className="action-button">
            <FaUtensils /> Bugün Yediğini Ekle
          </button>
          <button onClick={() => window.location.href = '/profile'} className="action-button">
            Profili Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;