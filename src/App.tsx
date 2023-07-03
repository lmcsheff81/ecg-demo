import React from "react";
import { PatientProvider } from "./context/PatientContext";

import router from "./router";
import { RouterProvider } from "react-router-dom";

const apiUrl = "http://localhost:3000/api/patient";

const App = () => {
  return (
    <React.StrictMode>
      <PatientProvider apiUrl={apiUrl}>
        <RouterProvider router={router}></RouterProvider>
      </PatientProvider>
    </React.StrictMode>
  );
};

export default App;
