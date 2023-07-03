import { useContext } from "react";
import { PatientContext, PatientContextProps } from "../context/PatientContext";

/*Fast refresh failing when dynamically importing components in Vite using React and typescript*/

export function usePatientContext(): PatientContextProps {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientContext must be used within a PatientProvider");
  }
  return context;
}
