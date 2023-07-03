import { ReactNode } from "react";
/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";

interface PatientBannerProps {
  patientObj: Partial<Patient>;
  children?: ReactNode;
  css?: SerializedStyles;
}

export interface Patient {
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
}

const moduleCss = {
  self: css`
    padding: 1rem;
    background: lightgrey;
  `,

  title: css`
    font-size: 1.5rem;
    font-weight: bold;
  `,

  block: css`
    display: flex;
    flex-direction: row;

    & .meta {
      margin-right: 1rem;
    }
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,

  meta: css`
    font-weight: bold;
    @media (max-width: 768px) {
      width: 100%;
      margin-right: 0;
    }
  `,

  label: css`
    font-size: 0.9rem;
    font-weight: lighter;
    margin-right: 0.2rem;
    &:after {
      content: ":";
    }
  `,
};

export function PatientBanner({ patientObj, children }: PatientBannerProps) {
  const {
    title,
    surname,
    forename,
    born,
    age,
    gender,
    hospitalID,
    clinician,
    ward,
    bay,
    bed,
  } = patientObj;

  return (
    <div css={moduleCss.self}>
      <div>
        <h1 css={moduleCss.title}>
          {surname}, {forename} ({title})
        </h1>
      </div>

      <div css={moduleCss.block}>
        <div className="meta" css={moduleCss.meta}>
          <span css={moduleCss.label}>Born</span>
          {born} ({age})
        </div>
        <div className="meta" css={moduleCss.meta}>
          <span css={moduleCss.label}>Gender</span>
          {gender}
        </div>
        <div className="meta" css={moduleCss.meta}>
          <span css={moduleCss.label}>Patient ID</span>
          {hospitalID}
        </div>
        <div className="meta" css={moduleCss.meta}>
          <span css={moduleCss.label}>Ward</span>
          {ward}
        </div>
        <div className="meta" css={moduleCss.meta}>
          <span css={moduleCss.label}>Bay/Bed</span>
          {bay}, {bed}
        </div>
        <div className="meta" css={moduleCss.meta}>
          <span css={moduleCss.label}>Clinician</span>
          {clinician}
        </div>
      </div>

      {children && children}
    </div>
  );
}
