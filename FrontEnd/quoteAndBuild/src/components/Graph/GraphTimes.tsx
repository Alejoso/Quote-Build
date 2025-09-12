import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Cost {
  name: string;
  cost: number;
}

interface PieChartProps {
  data: Cost[];
}

const BarChartTimes: React.FC<PieChartProps> = ({ data }) => {
  const labels = data.map(item => item.name);
  const values = data.map(item => item.cost);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Días",
        data: values,
        backgroundColor: [
          "#FF5733", 
          "#51A2FF",   
        ],
        borderColor: [
          "#FF5733",   
          "#51A2FF",     
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        font: {
          weight: "bold" as "bold",
          size: 18,
        },
        color: "#0C0A09",
        formatter: (value: number, context: any) => {
          const data = context.chart.data.datasets[0].data as number[];
          const total = data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChartTimes;

