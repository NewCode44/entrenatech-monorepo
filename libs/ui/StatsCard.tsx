
import React from 'react';
import Card from './Card';
import Icon from './Icon';
import { IconName } from '../../types/index';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: IconName;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change && change.startsWith('+');
  
  const iconColorMap: { [key in IconName]?: string } = {
      Dumbbell: 'text-blue-400',
      Play: 'text-green-400',
      Users: 'text-purple-400',
      TrendingUp: 'text-orange-400',
  }

  return (
    <Card className="flex items-center p-4">
      <div className={`p-3 rounded-lg bg-gray-800 mr-4 ${iconColorMap[icon] || 'text-gray-400'}`}>
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
                <p className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                    {change}
                </p>
            )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;