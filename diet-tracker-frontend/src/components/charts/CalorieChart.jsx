// src/components/charts/CalorieChart.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CalorieChart = ({ data }) => {
  // Günlerin sırasını ve eksik günleri kontrol et
  const sortedData = data.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayOfWeek" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} kalori`, 'Kalori']}
            labelFormatter={(label) => `Tarih: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="calories" 
            name="Günlük Kalori" 
            fill={sortedData.map(item => 
              item.calories > 2000 ? '#ff5252' : '#4caf50'
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default CalorieChart;