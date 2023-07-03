/** @jsxImportSource @emotion/react */
import { Outlet } from "react-router-dom";
import React, { ReactNode } from "react";
import { MAX_WIDTH } from "../../utils/consts";
import { css, SerializedStyles } from "@emotion/react";
import AppHeader from "../Header";
import PatientComponent from "../PatientComponent";

interface LayoutProps {
  children?: ReactNode;
}

const layoutStyles: SerializedStyles = css`
  margin: 0 auto;
  max-width: ${MAX_WIDTH};
  padding: 0;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Layout: React.FC<LayoutProps> = () => {
  return (
    <>
      <AppHeader />
      <div css={layoutStyles}>
        <PatientComponent />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
