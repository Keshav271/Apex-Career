import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchJobs } from '../store/jobSlice';
import { Search, MapPin, Loader2 } from 'lucide-react';

const SearchBar = () => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.jobs);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!role) return alert("Please enter a job title");
    dispatch(searchJobs({ role, location }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-1 items-center px-4 py-2 border-r border-gray-100">
          <Search className="text-blue-500 mr-2" size={20} />
          <input 
            className="w-full outline-none text-gray-700 bg-transparent"
            placeholder="Job title (e.g. React Developer)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        
        <div className="flex flex-1 items-center px-4 py-2">
          <MapPin className="text-red-400 mr-2" size={20} />
          <input 
            className="w-full outline-none text-gray-700 bg-transparent"
            placeholder="Location (e.g. Remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button 
          disabled={status === 'loading'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-50"
        >
          {status === 'loading' ? <Loader2 className="animate-spin" /> : "Search Jobs"}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;