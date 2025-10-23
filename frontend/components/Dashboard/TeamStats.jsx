import React from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Chart } from 'primereact/chart';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';

export default function TeamStats({ teamData = {} }) {
  const stats = {
    wins: 12,
    losses: 4,
    draws: 2,
    totalGoals: 24,
    totalAssists: 18,
    winRate: 75,
    avgGoalsPerMatch: 1.3,
    avgAssistsPerMatch: 1.0
  };

  const chartData = {
    labels: ['Ganados', 'Perdidos', 'Empates'],
    datasets: [
      {
        data: [stats.wins, stats.losses, stats.draws],
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  const topPlayers = [
    { name: 'Carlos Mendoza', position: 'Delantero', goals: 8, assists: 3, rating: 4.8 },
    { name: 'Luis Rodríguez', position: 'Mediocampista', goals: 3, assists: 7, rating: 4.6 },
    { name: 'Miguel Torres', position: 'Defensor', goals: 1, assists: 2, rating: 4.4 },
    { name: 'Andrés López', position: 'Portero', goals: 0, assists: 1, rating: 4.7 }
  ];

  return (
    <div className="grid">
      {/* Estadísticas Generales */}
      <div className="col-12 lg:col-8">
        <Card title="Estadísticas del Equipo">
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="text-center mb-4">
                <div className="text-900 font-bold text-3xl mb-2">{stats.winRate}%</div>
                <div className="text-500">Tasa de Victoria</div>
                <ProgressBar value={stats.winRate} className="mt-2" />
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="text-center mb-4">
                <div className="text-900 font-bold text-3xl mb-2">{stats.totalGoals}</div>
                <div className="text-500">Goles Totales</div>
                <div className="text-600 text-sm mt-1">{stats.avgGoalsPerMatch} por partido</div>
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="text-center mb-4">
                <div className="text-900 font-bold text-3xl mb-2">{stats.totalAssists}</div>
                <div className="text-500">Asistencias</div>
                <div className="text-600 text-sm mt-1">{stats.avgAssistsPerMatch} por partido</div>
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="text-center mb-4">
                <div className="text-900 font-bold text-3xl mb-2">{stats.wins + stats.losses + stats.draws}</div>
                <div className="text-500">Partidos Totales</div>
                <div className="text-600 text-sm mt-1">Esta temporada</div>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div className="grid">
            <div className="col-12 md:col-6">
              <h5 className="text-900 mb-3">Distribución de Resultados</h5>
              <div style={{ height: '200px' }}>
                <Chart type="doughnut" data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="col-12 md:col-6">
              <h5 className="text-900 mb-3">Rendimiento por Posición</h5>
              <div className="flex flex-column gap-3">
                <div>
                  <div className="flex justify-content-between mb-1">
                    <span className="text-600">Delanteros</span>
                    <span className="font-bold">8 goles</span>
                  </div>
                  <ProgressBar value={80} style={{ height: '6px' }} />
                </div>
                <div>
                  <div className="flex justify-content-between mb-1">
                    <span className="text-600">Mediocampistas</span>
                    <span className="font-bold">7 asistencias</span>
                  </div>
                  <ProgressBar value={70} style={{ height: '6px' }} />
                </div>
                <div>
                  <div className="flex justify-content-between mb-1">
                    <span className="text-600">Defensores</span>
                    <span className="font-bold">2 goles</span>
                  </div>
                  <ProgressBar value={20} style={{ height: '6px' }} />
                </div>
                <div>
                  <div className="flex justify-content-between mb-1">
                    <span className="text-600">Porteros</span>
                    <span className="font-bold">1 asistencia</span>
                  </div>
                  <ProgressBar value={10} style={{ height: '6px' }} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Jugadores */}
      <div className="col-12 lg:col-4">
        <Card title="Top Jugadores">
          <div className="flex flex-column gap-3">
            {topPlayers.map((player, index) => (
              <Panel key={player.name} header={`#${index + 1} ${player.name}`} toggleable>
                <div className="flex align-items-center justify-content-between mb-3">
                  <div className="flex align-items-center">
                    <Avatar 
                      icon="pi pi-user"
                      size="normal"
                      shape="circle"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-900">{player.name}</div>
                      <div className="text-500 text-sm">{player.position}</div>
                    </div>
                  </div>
                  <Tag value={`⭐ ${player.rating}`} severity="info" />
                </div>
                <div className="grid">
                  <div className="col-6 text-center">
                    <div className="text-900 font-bold">{player.goals}</div>
                    <div className="text-500 text-sm">Goles</div>
                  </div>
                  <div className="col-6 text-center">
                    <div className="text-900 font-bold">{player.assists}</div>
                    <div className="text-500 text-sm">Asistencias</div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
