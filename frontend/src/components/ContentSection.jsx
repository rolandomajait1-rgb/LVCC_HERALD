import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContentSection = ({ title, bgColor, viewAllUrl, children }) => {
  const navigate = useNavigate();

  return (
    <section className="mb-12">
      <div className={`${bgColor} text-white p-4 flex justify-between items-center`}>
        <h2 className="text-2xl font-serif font-bold">{title}</h2>
        {viewAllUrl && (
          <button
            onClick={() => navigate(viewAllUrl)}
            className="text-sm hover:underline"
          >
            View All
          </button>
        )}
      </div>
      <div className="bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
};

export default ContentSection;