import React from 'react';

import { ChevronRight } from 'lucide-react';

export default function ContentSection({ title, bgColor, viewAllUrl, children }) {
  return (
    <section className="mb-6">
      <div className={`flex justify-between items-center p-1 ${bgColor} text-white rounded-t-lg`}>
        <h2 className="text-lg font-bold">{title}</h2>
        <a href={viewAllUrl} className="text-white hover:underline flex items-center font-bold text-base">
          View All <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
      <div className="bg-white p-1 rounded-b-lg shadow">
        {children}
      </div>
    </section>
  );
}
