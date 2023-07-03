import { PatientBanner } from "./PatientBanner";
import { usePatientContext } from "../utils/patientUtils";

const PatientComponent = () => {
  const { patient } = usePatientContext();

  if (!patient) {
    // TODO:Handle scenarios where patient is not available
    return null;
  }

  return <PatientBanner patientObj={patient} />;
};

export default PatientComponent;
