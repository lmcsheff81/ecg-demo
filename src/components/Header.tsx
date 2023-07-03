import * as React from "react";
import Logo from "../assets/images/logo.svg";

const AppHeader: React.FC = () => {
  return (
    <nav className="bg-slate-200 py-4 px-1 box-content flex mb-3 font-semibold justify-start">
      <div className="m-auto w-full max-w-7xl">
        <img src={Logo} alt="idoven" />
        <div>Idoven.ai Coding Challenge - ECG (electrocardiogram) chart</div>
      </div>
    </nav>
  );
};

export default AppHeader;
