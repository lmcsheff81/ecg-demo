export const DEFAULT_PATIENT_OBJECT: {
  title: string;
  surname: string;
  forename: string;
  born: string;
  age: string;
  gender: string;
  hospitalID: number;
  nationalID: number;
  clinician: string;
  ward: string;
  bay: string;
  bed: string;
} = {
  title: "Mr",
  surname: "Alvarez Ferro",
  forename: "Juan",
  born: "01-Jan-1955",
  age: "75y",
  gender: "male",
  hospitalID: 156586656,
  nationalID: 5454645,
  clinician: "Dr Alba Fernandez",
  ward: "Cardiology",
  bay: "14",
  bed: "A45",
};

export const MAX_WIDTH = "1280px";

export const API_URL = `http://localhost:3000`;
