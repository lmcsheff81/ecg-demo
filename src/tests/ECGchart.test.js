import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Chart } from "react-chartjs-2";
import ECGchart from "../components/ECGchart";
import { usePatientContext } from "../utils/patientUtils";

jest.mock("react-chartjs-2", () => ({
  Chart: jest.fn(),
  Line: jest.fn(),
}));

jest.mock("../utils/patientUtils", () => ({
  usePatientContext: jest.fn(),
}));

describe("ECG chart component", () => {
  const mockPatient = {
    title: "Mr",
    surname: "Alvarez Ferro",
    forename: "Juan",
  };

  beforeAll(() => {
    Chart.register = jest.fn();
  });

  beforeEach(() => {
    usePatientContext.mockReturnValue({ patient: mockPatient });
  });

  test("should render all ECG chart buttons", () => {
    render(
      <ECGchart
        chartData={[1, 2, 3]}
        chartLabelData={["Label 1", "Label 2", "Label 3"]}
        getNextChunk={jest.fn()}
        getPreviousChunk={jest.fn()}
      />
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Zoom Out")).toBeInTheDocument();
    expect(screen.getByText("Zoom In")).toBeInTheDocument();
    expect(screen.getByText("Reset zoom")).toBeInTheDocument();
  });

  test("should call the correct function on a button click", () => {
    const getNextChunkMock = jest.fn();
    const getPreviousChunkMock = jest.fn();

    render(
      <ECGchart
        chartData={[1, 2, 3]}
        chartLabelData={["Label 1", "Label 2", "Label 3"]}
        getNextChunk={getNextChunkMock}
        getPreviousChunk={getPreviousChunkMock}
      />
    );

    const previousButton = screen.getByText("Previous");
    const nextButton = screen.getByText("Next");

    fireEvent.click(previousButton);
    fireEvent.click(nextButton);

    expect(getPreviousChunkMock).toHaveBeenCalledTimes(1);
    expect(getNextChunkMock).toHaveBeenCalledTimes(1);
  });

  test("should display the active ECG chart data chunk number", () => {
    const activeChunk = 3;

    render(
      <ECGchart
        chartData={[1, 2, 3]}
        chartLabelData={["Label 1", "Label 2", "Label 3"]}
        getNextChunk={jest.fn()}
        getPreviousChunk={jest.fn()}
        activeChunk={activeChunk}
      />
    );

    expect(
      screen.getByText(`Active ECG data point chunk: ${activeChunk}`)
    ).toBeInTheDocument();
  });

  test("should zoom in and out of teh ECG chart correctly", () => {
    const mockResetZoom = jest.fn();
    const mockZoom = jest.fn();

    const chartRef = createRef(); // Create a mock reference using createRef

    chartRef.current = {
      resetZoom: mockResetZoom,
      zoom: mockZoom,
      getZoomLevel: jest.fn(() => 1.0),
    };

    render(
      <ECGchart
        chartData={[225, 200, 355]}
        chartLabelData={["1.0", "1.2", "1.3"]}
        getNextChunk={jest.fn()}
        getPreviousChunk={jest.fn()}
        chartRef={chartRef}
      />
    );

    const zoomInButton = screen.getByText("Zoom In");
    const zoomOutButton = screen.getByText("Zoom Out");

    fireEvent.click(zoomInButton);
    fireEvent.click(zoomInButton);
    fireEvent.click(zoomOutButton);

    expect(chartRef.current.getZoomLevel()).toBeCloseTo(1.2, 0.1);
    expect(chartRef.current.getZoomLevel()).toBeCloseTo(1.0, 0.1);
  });
});
