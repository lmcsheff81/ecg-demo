import { useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { usePatientContext } from "../utils/patientUtils";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { ChartData, ChartOptions, Colors } from "chart.js";
import ChartZoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartZoomPlugin,
  Colors
);

interface ECGChartProps {
  chartData: number[];
  chartLabelData: string[];
  getNextChunk: () => void;
  getPreviousChunk: () => void;
  activeChunk: string | number;
  options?: ChartOptions<"line">; //https://react-chartjs-2.js.org/faq/typescript/
}

const ECGChart: React.FC<ECGChartProps> = ({
  chartData,
  chartLabelData,
  getNextChunk,
  getPreviousChunk,
  activeChunk,
  options,
}) => {
  const { patient } = usePatientContext();
  const chartRef = useRef<Chart<"line"> | null>(null);

  const defaultOptions: ChartOptions<"line"> = {
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 20,
        },
        title: {
          display: true,
          text: "Seconds",
          font: {
            size: 14,
          },
        },
        grid: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Millivolts (mV)",
          font: {
            size: 15,
          },
        },
        grid: {
          display: true,
        },
      },
    },
    responsive: true,

    plugins: {
      title: {
        display: true,
        text: `ECG Chart: ${patient?.surname ?? ""}, ${
          patient?.forename ?? ""
        } (${patient?.title ?? ""})`,
        font: {
          size: 18,
          weight: "bold",
        },
      },
      legend: {
        display: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: false,
          },
          mode: "xy",
        },
        pan: {
          enabled: true,
        },
      },
    },
  };

  if (options && Object.keys(options).length)
    Object.assign(defaultOptions, options);

  const chartDataConfig: ChartData<"line"> = {
    labels: chartLabelData,
    datasets: [
      {
        data: chartData,
        borderColor: "blue",
        borderWidth: 2,
        fill: true,
        tension: 1,
        pointRadius: 0,
      },
    ],
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const handleZoomIn = () => {
    if (chartRef.current) {
      //const currentZoomLevel = chartRef.current.getZoomLevel();
      chartRef.current.zoom(1.1);
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      //const currentZoomLevel = chartRef.current.getZoomLevel();
      chartRef.current.zoom(0.9);
    }
  };

  return (
    <div>
      <div style={{ width: "100%" }} className="box-content">
        <Line ref={chartRef} options={defaultOptions} data={chartDataConfig} />
      </div>
      <div className="my-2">
        <Stack spacing={2} direction="row">
          <Button onClick={getPreviousChunk} variant="contained">
            Previous
          </Button>
          <Button onClick={getNextChunk} variant="contained">
            Next
          </Button>
          <Button onClick={handleZoomOut} variant="contained">
            Zoom Out
          </Button>
          <Button onClick={handleZoomIn} variant="contained">
            Zoom In
          </Button>
          <Button onClick={handleResetZoom} variant="contained">
            Reset zoom
          </Button>
        </Stack>
      </div>
      <div className="font-bold mt-8 mb-16 border-t border-slate-500 pt-4 text-lg">
        Active ECG data point chunk: {activeChunk}
      </div>
    </div>
  );
};

export default ECGChart;
