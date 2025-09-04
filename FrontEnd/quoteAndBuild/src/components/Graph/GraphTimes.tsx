import React from "react";
import { Pie } from "react-chartjs-2";
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

const PieChartTimes: React.FC<PieChartProps> = ({ data }) => {
  const labels = data.map(item => item.name);
  const values = data.map(item => item.cost);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Días",
        data: values,
        backgroundColor: [
          "#4338CA", //Moradito fo
          "#51A2FF",   // verde
        ],
        borderColor: [
          "#4338CA",   // borde naranja
          "#51A2FF",     // borde verde
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const
      },
      datalabels: {
        color: "#fff",
        formatter: (value: number, context: any) => {
          const data = context.chart.data.datasets[0].data as number[];
          const total = data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChartTimes;

