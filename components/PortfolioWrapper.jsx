"use client";

import Preloader from "@/components/Preloader";

export default function PortfolioWrapper({ children, name }) {
  return (
    <>
      <Preloader name={name} />
      {children}
    </>
  );
}
