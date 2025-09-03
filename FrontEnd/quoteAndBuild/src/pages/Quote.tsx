import React, { useEffect, useState } from "react";
import { createQuote, fetchQuotesByPhase } from "../api/calls";
import QuoteTable from "../components/Quote/QuoteTable";
import type { Quote } from "../types/interfaces";

type Props = {
  phaseId: number;
};

const QuotePage: React.FC<Props> = ({ phaseId }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchQuotesByPhase(phaseId).then((res) => {
      setQuotes(res.data);
      if (res.data.length > 0) {
        setSelectedQuoteId(res.data[0].id); // por defecto la primera cotización
      }
    });
  }, [phaseId]);

  const handleCreateQuote = async () => {
    const { data } = await createQuote({ phase: phaseId, name: "Nueva cotización" });
    setQuotes([...quotes, data]);
    setSelectedQuoteId(data.id);
  };

  return (
    <div className="container mt-4">
      <h2>Cotizaciones de la fase</h2>
      <button className="btn btn-primary mb-3" onClick={handleCreateQuote}>
        ➕ Nueva cotización
      </button>

      {selectedQuoteId ? (
        <QuoteTable quoteId={selectedQuoteId} />
      ) : (
        <p>No hay cotizaciones aún.</p>
      )}
    </div>
  );
};

export default QuotePage;
