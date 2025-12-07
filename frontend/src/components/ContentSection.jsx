import React from 'react';

import { ChevronRight } from 'lucide-react';

export default function ContentSection({ title, bgColor, viewAllUrl, children }) {
  return (
    <section className="mb-8">
      <div className={`flex justify-between items-center px-4 py-2.5 ${bgColor} text-white`}>
        <h2 className="text-base font-bold uppercase tracking-wide">{title}</h2>
        <a href={viewAllUrl} className="text-white hover:underline flex items-center font-medium text-sm">
          View All <ChevronRight size={14} className="ml-1" />
        </a>
      </div>
      <div className="bg-white p-4 border border-gray-200 border-t-0">
        {children}
      </div>
    </section>
  );
}
