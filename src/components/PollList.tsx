import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import PollCard from './PollCard';
import { Filter } from 'lucide-react';

const PollList: React.FC = () => {
  const { polls } = useVoting();
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostVotes'>('newest');

  const filteredPolls = polls.filter(poll => {
    if (filter === 'all') return true;
    if (filter === 'active') return poll.isActive && (!poll.endDate || new Date(poll.endDate) > new Date());
    if (filter === 'ended') return !poll.isActive || (poll.endDate && new Date(poll.endDate) <= new Date());
    return true;
  });

  const sortedPolls = [...filteredPolls].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'mostVotes') {
      const votesA = a.options.reduce((sum, option) => sum + option.votes, 0);
      const votesB = b.options.reduce((sum, option) => sum + option.votes, 0);
      return votesB - votesA;
    }
    return 0;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold">Polls</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="pl-8 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Polls</option>
              <option value="active">Active Polls</option>
              <option value="ended">Ended Polls</option>
            </select>
            <Filter size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostVotes">Most Votes</option>
          </select>
        </div>
      </div>

      {sortedPolls.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No polls found</p>
        </div>
      ) : (
        <div>
          {sortedPolls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PollList;