// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import DailySummary from '../components/dashboard/DailySummary';
import WeeklySummary from '../components/dashboard/WeeklySummary';
import CalorieChart from '../components/charts/CalorieChart';
import { getDailyFoods, getWeeklyAnalysis } from '../api/foodService';

const DashboardPage = () => {
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
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
        setWeeklyData(weeklyResult);
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
    return <div className="loading">Yükleniyor...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="dashboard-summary">
        <DailySummary data={dailyData} />
        <WeeklySummary data={weeklyData} />
      </div>
      
      <div className="dashboard-charts">
        <h2>Haftalık Kalori Alımı</h2>
        {weeklyData && <CalorieChart data={weeklyData.dailyData} />}
      </div>
    </div>
  );
};

export default DashboardPage;