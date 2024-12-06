import React, { useState } from "react";

const Help = ({ theme }) => {
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
    {
      question: "Can I edit my idea after submission?",
      answer: "Yes, you can edit your idea until it is approved or deleted.",
    },
    {
      question: "How do I delete my idea?",
      answer: "Go to the 'Bin' page, where you can permanently delete your idea.",
    },
    {
      question: "Who can see my idea?",
      answer: "Your idea will be visible to other users once it is approved.",
    },
  ];

  return (
    <div
      className={`min-h-screen px-6 py-8 ${theme === "dark"
          ? "bg-gradient-to-b from-[#1e293b] via-[#151f2d] to-[#0f172a] text-[#e2e8f0]"
          : "bg-gradient-to-b from-[#f3f8ff] via-[#d1e3ff] to-[#a9c9ff] text-[#2d3748]"}`
      }
    >
      {/* Title Section */}
      <div className="pt-24 pb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-wide">
          {theme === 'dark' ? (
            <span className="text-indigo-400">Help & Support</span>
          ) : (
            <span className="text-indigo-600">Help & Support</span>
          )}
        </h1>
        <p
          className={`mt-4 text-lg font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Find answers to common questions and get assistance
        </p>
      </div>

      {/* FAQs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md border dark:border-gray-700 ${
                theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
              }`}
            >
              <div
                className={`font-semibold px-6 py-4 rounded-t-lg flex justify-between items-center cursor-pointer ${
                  theme === "dark" ? "bg-gray-700 text-white" : "bg-indigo-200 text-gray-800"
                }`}
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <span>{faqOpen === index ? "-" : "+"}</span>
              </div>
              {faqOpen === index && (
                <div
                  className={`px-6 py-4 border-t-2 rounded-b-lg ${
                    theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-blue-100 text-gray-800"
                  }`}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Help;
