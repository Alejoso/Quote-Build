import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale, // eje X (categorías)
    LinearScale,  // eje Y (numérico)
    BarElement,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Cost {
  name: string;
  cost: number;
}

interface PieChartProps {
  data: Cost[];
}

const BarChartCostTime: React.FC<PieChartProps> = ({ data }) => {
    const labels = data.map(item => item.name);
    const values = data.map(item => item.cost);
  
    const chartData = {
      labels,
      datasets: [
        {
          label: "Días",
          data: values,
          backgroundColor: [
            "#4338CA", // morado
            "#51A2FF", // azulito
          ],
          borderColor: [
            "#312E81", // morado más oscuro
            "#2563EB", // azul más oscuro
          ],
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // ocultar la leyenda si solo hay un dataset
        },
      },
      scales: {
        y: {
          beginAtZero: true, // el eje Y empieza en 0
        },
      },
    };

  return <Bar data={chartData} options={options} />;
};

export default BarChartCostTime;

