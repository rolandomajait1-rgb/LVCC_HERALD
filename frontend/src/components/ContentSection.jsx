import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function ContentSection({ title, bgColor, viewAllUrl, children }) {
  return (
    <section className="mb-8">
      <div className={`flex justify-between items-center p-4 ${bgColor} text-white rounded-t-lg`}>
        <h2 className="text-xl font-bold">{title}</h2>
        <Link to={viewAllUrl} className="text-white hover:underline flex items-center font-bold text-base">
          View All <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
      <div className="bg-white p-4 rounded-b-lg shadow">
        {children}
      </div>
    </section>
  );
}
