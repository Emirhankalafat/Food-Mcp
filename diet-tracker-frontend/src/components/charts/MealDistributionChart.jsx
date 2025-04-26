// src/components/charts/MealDistributionChart.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MealDistributionChart = ({ data }) => {
  // Veri yoksa boş bir div göster
  if (!data || !Object.keys(data).length) {
    return <div>Veri bulunamadı</div>;
  }

  // Veriyi grafik için uygun formata dönüştür
  const chartData = Object.keys(data).map(meal => ({
    name: meal.charAt(0).toUpperCase() + meal.slice(1),
    value: data[meal]
  }));

  return (
    <div className="chart-container">
      <h3>Öğün Dağılımı</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} kalori`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MealDistributionChart;