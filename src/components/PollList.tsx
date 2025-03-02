import React, { useState, useEffect } from 'react';
import { useVoting } from '../context/VotingContext';
import PollCard from './PollCard';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PollList: React.FC = () => {
  const { polls } = useVoting();
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostVotes' | 'leastVotes'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Reset search when component unmounts
  useEffect(() => {
    return () => setSearchTerm('');
  }, []);

  const filteredPolls = polls.filter(poll => {
    // Apply status filter
    if (filter === 'all') {
      // Continue to search filter
    } else if (filter === 'active') {
      if (!poll.isActive || (poll.endDate && new Date(poll.endDate) <= new Date())) {
        return false;
      }
    } else if (filter === 'ended') {
      if (poll.isActive && (!poll.endDate || new Date(poll.endDate) > new Date())) {
        return false;
      }
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      return (
        poll.title.toLowerCase().includes(searchLower) ||
        poll.description.toLowerCase().includes(searchLower) ||
        poll.options.some(option => option.text.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const sortedPolls = [...filteredPolls].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    
    const votesA = a.options.reduce((sum, option) => sum + option.votes, 0);
    const votesB = b.options.reduce((sum, option) => sum + option.votes, 0);
    
    if (sortBy === 'mostVotes') return votesB - votesA;
    if (sortBy === 'leastVotes') return votesA - votesB;
    
    return 0;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            Polls
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredPolls.length} {filteredPolls.length === 1 ? 'poll' : 'polls'})
            </span>
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search polls..."
                className="pl-8 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded border ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="pl-8 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="all">All Polls</option>
                    <option value="active">Active Polls</option>
                    <option value="ended">Ended Polls</option>
                  </select>
                  <Filter size={14} className="absolute left-2.5 top-[calc(50%+0.25rem)] transform -translate-y-1/2 text-gray-500" />
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="mostVotes">Most Votes</option>
                    <option value="leastVotes">Least Votes</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {sortedPolls.length === 0 ? (
        <motion.div 
          className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {searchTerm ? (
            <>
              <p className="text-gray-500 mb-2">No polls found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear search
              </button>
            </>
          ) : (
            <p className="text-gray-500">No polls found</p>
          )}
        </motion.div>
      ) : (
        <div>
          <AnimatePresence>
            {sortedPolls.map(poll => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PollCard poll={poll} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PollList;