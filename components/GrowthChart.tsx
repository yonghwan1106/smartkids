
import React from 'react';
import type { HealthRecord } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: HealthRecord[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold text-gray-800">{`Date: ${label}`}</p>
          <p className="text-blue-500">{`Height: ${payload[0].value} cm`}</p>
          <p className="text-green-500">{`Weight: ${payload[1].value} kg`}</p>
        </div>
      );
    }
    return null;
};

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-10">No growth data available. Add a record to see the chart.</div>
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="recordDate" stroke="#6b7280" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" stroke="#4A90E2" label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft', fill: '#4A90E2' }} tick={{ fontSize: 12, fill: '#4A90E2' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#50E3C2" label={{ value: 'Weight (kg)', angle: -90, position: 'insideRight', fill: '#50E3C2' }} tick={{ fontSize: 12, fill: '#50E3C2' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="heightCm" name="Height (cm)" stroke="#4A90E2" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line yAxisId="right" type="monotone" dataKey="weightKg" name="Weight (kg)" stroke="#50E3C2" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;
