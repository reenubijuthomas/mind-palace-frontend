import React, { useState } from "react";

const Help = () => {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Mind Palace?",
      answer: "Mind Palace is a platform for sharing and managing innovative ideas.",
    },
    {
      question: "How do I submit an idea?",
      answer: "Navigate to the 'Submit Idea' page, fill out the form, and click submit.",
    },
    {
      question: "What happens if my idea is rejected?",
      answer: "Rejected ideas are moved to the 'Bin,' where you can review or edit them.",
    },
    {
      question: "How do I recover a deleted idea?",
      answer: "Go to the 'Bin' page and restore the idea from there.",
    },
  ];

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Help & Support</h1>

      {/* FAQs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <div
                className="font-bold bg-gray-100 px-4 py-2 rounded flex justify-between items-center cursor-pointer border border-gray-300"
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <span>{faqOpen === index ? "-" : "+"}</span>
              </div>
              {faqOpen === index && (
                <div className="bg-blue-100 px-4 py-3 border-l-4 border-blue-500">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* User Guide Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6">User Guide</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Go to the 'Submit Idea' page to share your innovative ideas.</li>
          <li>View pending approvals in the 'Approvals' section.</li>
          <li>Check deleted ideas in the 'Bin' and restore them if needed.</li>
        </ul>
      </section>

      {/* Troubleshooting Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Troubleshooting</h2>
        <p>If you're experiencing issues, try these steps:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ensure you are logged in to access all features.</li>
          <li>Clear your browser cache if pages do not load correctly.</li>
          <li>Contact support if problems persist.</li>
        </ul>
      </section>

      {/* Feedback Section */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-6">Feedback</h2>
        <p className="mb-4 text-center">Have suggestions or facing issues? Let us know below:</p>
        <form className="flex flex-col space-y-4">
          <textarea
            placeholder="Write your feedback here..."
            rows="4"
            className="w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
          >
            Submit Feedback
          </button>
        </form>
      </section>
    </div>
  );
};

export default Help;
