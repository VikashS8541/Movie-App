import React from "react";
import PricingList from "../components/PricingList";

const Pricing = () => {
  return (
    <section className="pricing-main padding-top">
      <div className="container">
        <h1 className="text-5xl font-semibold">Pricing</h1>
      </div>
      <PricingList />
    </section>
  );
};

export default Pricing;
