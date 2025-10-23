import React from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue', 
  trend = null, 
  progress = null,
  badge = null,
  onClick = null 
}) {
  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-500',
      green: 'bg-green-100 text-green-500',
      purple: 'bg-purple-100 text-purple-500',
      orange: 'bg-orange-100 text-orange-500',
      red: 'bg-red-100 text-red-500',
      yellow: 'bg-yellow-100 text-yellow-500'
    };
    return colors[color] || colors.blue;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'pi pi-arrow-up';
    if (trend < 0) return 'pi pi-arrow-down';
    return 'pi pi-minus';
  };

  return (
    <Card 
      className="h-full cursor-pointer hover:shadow-4 transition-shadow transition-duration-200"
      onClick={onClick}
    >
      <div className="flex align-items-center justify-content-between mb-3">
        <div className="flex-1">
          <span className="block text-500 font-medium mb-2">{title}</span>
          <div className="text-900 font-bold text-2xl mb-1">{value}</div>
          {subtitle && (
            <div className="text-500 text-sm">{subtitle}</div>
          )}
        </div>
        <div className={`flex align-items-center justify-content-center border-round ${getColorClass(color)}`} 
             style={{ width: '3rem', height: '3rem' }}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      
      {trend !== null && (
        <div className="flex align-items-center justify-content-between">
          <div className={`flex align-items-center ${getTrendColor(trend)}`}>
            <i className={`${getTrendIcon(trend)} mr-1`}></i>
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
          {badge && (
            <Badge value={badge} severity="info" size="small" />
          )}
        </div>
      )}
      
      {progress !== null && (
        <div className="mt-3">
          <ProgressBar 
            value={progress} 
            style={{ height: '6px' }}
            className="mb-2"
          />
          <div className="text-500 text-sm text-center">{progress}% completado</div>
        </div>
      )}
    </Card>
  );
}
