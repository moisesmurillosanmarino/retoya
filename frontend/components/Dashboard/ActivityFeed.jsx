import React from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Timeline } from 'primereact/timeline';
import { Divider } from 'primereact/divider';

export default function ActivityFeed({ activities = [] }) {
  const getActivityIcon = (type) => {
    const icons = {
      match: 'pi pi-calendar',
      goal: 'pi pi-circle-fill',
      challenge: 'pi pi-bolt',
      team: 'pi pi-users',
      tournament: 'pi pi-trophy',
      court: 'pi pi-building',
      default: 'pi pi-info-circle'
    };
    return icons[type] || icons.default;
  };

  const getActivityColor = (type) => {
    const colors = {
      match: 'text-blue-500',
      goal: 'text-green-500',
      challenge: 'text-orange-500',
      team: 'text-purple-500',
      tournament: 'text-yellow-500',
      court: 'text-cyan-500',
      default: 'text-gray-500'
    };
    return colors[type] || colors.default;
  };

  const getActivityStatus = (status) => {
    const statuses = {
      success: { severity: 'success', label: 'Exitoso' },
      warning: { severity: 'warning', label: 'Pendiente' },
      info: { severity: 'info', label: 'Información' },
      danger: { severity: 'danger', label: 'Error' }
    };
    return statuses[status] || statuses.info;
  };

  return (
    <Card title="Actividad Reciente" className="h-full">
      <ScrollPanel style={{ height: '400px' }}>
        <Timeline 
          value={activities} 
          content={(item) => (
            <div className="flex align-items-start">
              <div className={`flex align-items-center justify-content-center border-round mr-3 ${getActivityColor(item.type)}`}
                   style={{ width: '2rem', height: '2rem', backgroundColor: `${getActivityColor(item.type)}20` }}>
                <i className={`${getActivityIcon(item.type)} text-sm`}></i>
              </div>
              <div className="flex-1">
                <div className="flex align-items-center justify-content-between mb-1">
                  <span className="font-medium text-900">{item.title}</span>
                  <Tag 
                    value={getActivityStatus(item.status).label}
                    severity={getActivityStatus(item.status).severity}
                    size="small"
                  />
                </div>
                <p className="text-600 text-sm mb-2 m-0">{item.description}</p>
                <div className="flex align-items-center justify-content-between">
                  <span className="text-500 text-xs">{item.time}</span>
                  {item.action && (
                    <Button 
                      label={item.action.label}
                      size="small"
                      text
                      className="p-button-sm"
                      onClick={item.action.onClick}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        />
      </ScrollPanel>
    </Card>
  );
}
