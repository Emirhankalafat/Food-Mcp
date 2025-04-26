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
  // Renk ve günleri ayarla
  const customizeData = data.map(item => ({
    ...item,
    fill: item.calories > 2000 ? '#ff5252' : '#4caf50', // 2000 kaloriden fazla ise kırmızı
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={customizeData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayOfWeek" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [`${value} kalori`, 'Kalori']}
            labelFormatter={label => `${label}`}
          />
          <Legend />
          <Bar dataKey="calories" name="Kalori" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CalorieChart;