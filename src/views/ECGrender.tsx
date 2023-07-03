import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ECGchart from "../components/ECGchart";
import { API_URL } from "../utils/consts";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // TODO: Replace with appropriate server URL

interface ECGData {
  time: string;
  ecgDataPoints: [number];
}

function ECGrender() {
  const [chartData, setChartData] = useState<[]>([]);
  const [chartLabelData, setChartLabelData] = useState<string[]>([]);
  const [activeChunk, setActiveChunk] = useState<number>(1);
  const [totalCountOfChunks, setTotalCountOfChunks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchEcgData = async (chunk: string | number) => {
    try {
      const response = await fetch(`${API_URL}/api/ecg-data?chunk=${chunk}`);

      if (!response.ok) throw new Error("Error fetching ECG data");

      const json: { data: Array<ECGData> } = await response.json();

      setChartLabelData(json.data.map((item) => item.time));
      setChartData(
        json.data.map((item) => item.ecgDataPoints).flat(Infinity) as []
      );

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getNextChunk = async () => {
    try {
      // Set the local state
      if (activeChunk === totalCountOfChunks) return;
      const newChunkValue = activeChunk + 1;
      setActiveChunk(newChunkValue);
      if (newChunkValue <= totalCountOfChunks)
        await fetchEcgData(newChunkValue);
    } catch (e) {
      console.error(e);
    }
  };
  const getPreviousChunk = async () => {
    try {
      // Set the local state
      const newChunkValue = activeChunk - 1;

      if (newChunkValue > 0) {
        setActiveChunk(newChunkValue);
        await fetchEcgData(newChunkValue);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Listen for the "indexGenerated" event from the service, indicating that the large ECG file has been indexed for chunked/fast response processing
    socket.on("indexGenerated", (chunks: number) => {
      console.log(`Index is generated with ${chunks} mapped`);
      setTotalCountOfChunks(chunks);

      const fetchData = async () => {
        await fetchEcgData(activeChunk);
      };

      try {
        fetchData();
      } catch (err) {
        console.error(err);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("indexGenerated");
    };
  }, [activeChunk]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center align-middle my-16">
        <Box className="text-lg items-center" sx={{ display: "flex" }}>
          <span className="mr-4 font-bold">
            Please wait, preparing first load of patient ECG data...
          </span>{" "}
          <CircularProgress size={60} />
        </Box>
      </div>
    );

  return (
    <div>
      {!isLoading && (
        <div>
          <ECGchart
            activeChunk={activeChunk}
            chartData={chartData}
            chartLabelData={chartLabelData}
            getNextChunk={getNextChunk}
            getPreviousChunk={getPreviousChunk}
          />
        </div>
      )}
    </div>
  );
}

export default ECGrender;
