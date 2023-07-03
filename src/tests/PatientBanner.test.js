import React from "react";
import { render, screen } from "@testing-library/react";
import { PatientBanner } from "../components/PatientBanner";

const patientObj = {
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

test("renders all patient data correctly", () => {
  render(<PatientBanner patientObj={patientObj} />);

  const fullName = screen.getByText(/Alvarez Ferro, Juan/);
  const title = screen.getByText(/Mr/);
  const born = screen.getByText(/01-Jan-1955/);
  const age = screen.getByText(/75y/);
  const gender = screen.getByText(/male/);
  const patientID = screen.getByText(/156586656/);
  const ward = screen.getByText(/Cardiology/);
  const bayBed = screen.getByText(/14, A45/);
  const clinician = screen.getByText(/Dr Alba Fernandez/);

  expect(fullName).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(born).toBeInTheDocument();
  expect(age).toBeInTheDocument();
  expect(gender).toBeInTheDocument();
  expect(patientID).toBeInTheDocument();
  expect(ward).toBeInTheDocument();
  expect(bayBed).toBeInTheDocument();
  expect(clinician).toBeInTheDocument();
});
