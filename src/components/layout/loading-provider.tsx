"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#ffffff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
