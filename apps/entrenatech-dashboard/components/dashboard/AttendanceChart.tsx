import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ATTENDANCE_DATA } from '../../constants';

const AttendanceChart: React.FC = () => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart data={ATTENDANCE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#4A5568" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4A5568" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${value}`} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1A1A2E', 
                            border: '1px solid #2D3748', 
                            borderRadius: '0.75rem',
                            color: '#FFFFFF' 
                        }} 
                        itemStyle={{ color: '#FFFFFF' }}
                        labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="Check-ins" stroke="#2196F3" strokeWidth={2} fillOpacity={1} fill="url(#colorCheckins)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AttendanceChart;