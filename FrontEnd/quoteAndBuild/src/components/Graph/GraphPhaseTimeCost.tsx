import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface DataPoint {
  name: string;
  cost: number; // costo
  time: number; // tiempo
}

interface LineChartProps {
  data: DataPoint[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((point) => point.name), // usar los nombres como etiquetas del eje X
    datasets: [
      {
        label: "Costo vs Tiempo",
        data: data.map((point) => ({ x: point.cost, y: point.time , name: point.name})),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: false,
        tension: 0, // línea recta
      },
    ],
  };

  const costs = data.map(p => p.cost);
  const times = data.map(p => p.time);
  
  const options = {
    responsive: true,
    parsing: false as const,
    plugins: {
        tooltip: {
        callbacks: {
            title: function (contexts: any) {
                const point = contexts[0].raw as { name: string; x: number; y: number; };
                return point.name; // 👈 esto reemplaza el "20000" en negrilla
              },
            label: function (context: any) {
            const point = context.raw as { x: number; y: number; name: string };
            return `(${point.x.toLocaleString()}, ${point.y})`; // 👈 lo que quieras mostrar
            },
        },
        },
        datalabels: {
            display: true,
            align: "top" as const, // Ensure align is a valid value
            formatter: (value: any) => value.name, // nombre fijo sobre el punto
          },
    },
    scales: {
      x: {
        type: "linear" as const,
        title: { display: true, text: "Costo" },
        suggestedMin: Math.min(...costs) * 0.9,
        suggestedMax: Math.max(...costs) * 1.1,
      },
      y: {
        title: { display: true, text: "Tiempo" },
        suggestedMin: Math.min(...times) * 0.9,
        suggestedMax: Math.max(...times) * 1.1,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;