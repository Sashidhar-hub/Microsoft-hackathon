'use client';

import Chart from 'react-apexcharts';

export default function EnergyChart() {
  const options = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#005faa', '#79dd68'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    grid: {
      borderColor: '#efeeed',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      categories: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#404752',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) { return val + " kW" },
        style: {
          colors: '#404752',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      theme: 'light',
      x: { show: true }
    }
  };

  const series = [{
    name: 'Actual Consumption',
    data: [31, 40, 28, 51, 42, 109, 100, 120, 150, 140, 110, 90]
  }, {
    name: 'Predicted Baseline',
    data: [11, 32, 45, 32, 34, 52, 41, 60, 130, 120, 95, 80]
  }];

  return (
    <div className="h-80 w-full">
      <Chart options={options} series={series} type="area" height={320} />
    </div>
  );
}
