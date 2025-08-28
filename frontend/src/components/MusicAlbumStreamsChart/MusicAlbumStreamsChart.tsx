"use client";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { StreamCountPerDay } from "@/types/MusicStream";
import { useEffect, useState } from "react";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StreamsChartProps {
    data: StreamCountPerDay[];
    title: string;
}

export default function StreamsChart({ data, title }: StreamsChartProps) {
    const [bgColor, setBgColor] = useState("rgba(75,192,192,0.7)");

    useEffect(() => {
        const root = getComputedStyle(document.documentElement);
        const cssVar = root.getPropertyValue("--text-shadow").trim();
        if (cssVar) setBgColor(cssVar);
    }, []);

    const chartData = {
        labels: data.map((d) =>
            new Date(d.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            })
        ),
        datasets: [
            {
                label: "Streams",
                data: data.map((d) => d.total_streams),
                backgroundColor: bgColor,
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}
