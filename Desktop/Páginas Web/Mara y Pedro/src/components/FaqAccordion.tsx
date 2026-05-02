import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  backgroundImage?: string;
}

const FaqAccordion = ({ items, backgroundImage }: FaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container" style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
      <div className="faq-overlay">
        <div className="faq-content">
          {items.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleQuestion(index)}
              >
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-toggle-icon">+</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;
