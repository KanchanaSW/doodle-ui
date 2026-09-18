"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
} from "doodleui-react";

export function SupportFaqCard() {
  return (
    <Card title="Support FAQ" shadow={false} style={{ width: "100%" }}>
      <Accordion defaultValue="payout">
        <AccordionItem value="payout">
          <AccordionTrigger>When do payouts land?</AccordionTrigger>
          <AccordionContent>
            Verified accounts settle within 2–3 business days after you hit the
            threshold.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="seed">
          <AccordionTrigger>Can I lock the sketch?</AccordionTrigger>
          <AccordionContent>
            Pass a fixed seed on any component, or omit it and Shuffle redraws
            the whole page.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="theme">
          <AccordionTrigger>How do themes work?</AccordionTrigger>
          <AccordionContent>
            Set paper, ink, and accent CSS variables — every stroke picks them
            up automatically.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
