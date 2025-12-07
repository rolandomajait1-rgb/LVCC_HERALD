import React from 'react';

import { ChevronRight } from 'lucide-react';

export default function ContentSection({ title, bgColor, viewAllUrl, children }) {
  return (
    <section className="mb-10">
      <div className={`flex justify-between items-center px-4 py-3 ${bgColor} text-white`}>
        <h2 className="text-lg font-bold uppercase">{title}</h2>
        <a href={viewAllUrl} className="text-white hover:underline flex items-center font-semibold text-sm">
          View All <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
      <div className="bg-white p-6 shadow-sm border border-gray-200 border-t-0">
        {children}
      </div>
    </section>
  );
}
