import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import type {ChartOptions} from "chart.js"; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

interface Ratio {
  name: string;
  ratio: number;
}

interface BarChartProps {
  data: Ratio[];
}

const BarChartCostTime: React.FC<BarChartProps> = ({ data }) => {
  const labels = data.map(item => item.name);
  // <-- asegurar numbers, no strings
  const values = data.map(item => Number(item.ratio.toFixed(2)));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Costo/Tiempo",
        data: values,
        backgroundColor: ["#31D492", "#42D3F2"],
        borderColor: ["#31D492", "#42D3F2"],
        borderWidth: 1,
      },
    ],
  };

  // declarar opciones con un pequeño "escape" en plugins
  const options: ChartOptions<"bar"> & { plugins?: any } = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#0C0A09",    // color del número dentro de la barra
        anchor: "center",
        align: "center",
        font: { size: 14 , weight: "bold"},
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChartCostTime;
