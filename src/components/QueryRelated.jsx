import React, { useId } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import useMovieData from "../context/useMovieData";


const QueryRelated = () => {
  const id = useId();
  const { faqData } = useMovieData();
  return (
    <section className="faq-related-queries relative pt-20 py-10">
      <div className="container">
        <h2 className="lg:text-5xl md:text-3xl text-2xl mb-20 text-center font-semibold">The Omni Questions Everyone's Asking</h2>
        <div className="accordion-main flex flex-col gap-5">
          {faqData.map((faq,index)=>(
          <Accordion key={faq.id} className="accordion-boxes" defaultExpanded={index === 0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-panel1-content`}
              id={`${id}-panel1-header`}
            >
              <Typography component="span">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails className="accordion-text">
              {faq.answer}
            </AccordionDetails>
          </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QueryRelated;
