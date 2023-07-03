import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import ECGrender from "../views/ECGrender";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ECGrender />,
      },
      {
        path: "/test",
        element: <div>Hello world test!!!</div>,
      },
    ],
  },
]);

export default router;
