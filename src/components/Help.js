import React, { useState } from 'react';
import './HelpSettings.css';

const Help = () => {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqs = [
    { question: "What is Mind Palace?", answer: "Mind Palace is a platform for sharing and managing innovative ideas." },
    { question: "How do I submit an idea?", answer: "Navigate to the 'Submit Idea' page, fill out the form, and click submit." },
    { question: "What happens if my idea is rejected?", answer: "Rejected ideas are moved to the 'Bin,' where you can review or edit them." },
    { question: "How do I recover a deleted idea?", answer: "Go to the 'Bin' page and restore the idea from there." },
  ];

  return (
    <div className="help-page">
      <h1>Help & Support</h1>

      {/* FAQs Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <span className="faq-toggle">{faqOpen === index ? '-' : '+'}</span>
              </div>
              {faqOpen === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* User Guide Section */}
      <section className="user-guide">
        <h2>User Guide</h2>
        <ul>
          <li>Go to the 'Submit Idea' page to share your innovative ideas.</li>
          <li>View pending approvals in the 'Approvals' section.</li>
          <li>Check deleted ideas in the 'Bin' and restore them if needed.</li>
        </ul>
      </section>

      {/* Troubleshooting Section */}
      <section className="troubleshooting">
        <h2>Troubleshooting</h2>
        <p>
          If you're experiencing issues, try these steps:
        </p>
        <ul>
          <li>Ensure you are logged in to access all features.</li>
          <li>Clear your browser cache if pages do not load correctly.</li>
          <li>Contact support if problems persist.</li>
        </ul>
      </section>

      {/* Feedback Section */}
      <section className="feedback">
        <h2>Feedback</h2>
        <p>Have suggestions or facing issues? Let us know below:</p>
        <form className="feedback-form">
          <textarea placeholder="Write your feedback here..." rows="4" />
          <button type="submit">Submit Feedback</button>
        </form>
      </section>
    </div>
  );
};

export default Help;
