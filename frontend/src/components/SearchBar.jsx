import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md">
      <input
        id="search-input"
        name="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles or authors..."
        className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-3 md:px-4 py-2 bg-blue-600 text-white text-sm md:text-base font-medium rounded-r-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
