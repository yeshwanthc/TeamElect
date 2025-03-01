import React from 'react';
import { useVoting } from '../context/VotingContext';
import PollCard from './PollCard';
import { BarChart } from 'lucide-react';

const PollResults: React.FC = () => {
  const { polls } = useVoting();

  // Sort polls by total votes (descending)
  const sortedPolls = [...polls].sort((a, b) => {
    const votesA = a.options.reduce((sum, option) => sum + option.votes, 0);
    const votesB = b.options.reduce((sum, option) => sum + option.votes, 0);
    return votesB - votesA;
  });

  return (
    <div>
      <div className="flex items-center mb-4">
        <BarChart size={20} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold">Poll Results</h2>
      </div>

      {sortedPolls.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No polls available</p>
        </div>
      ) : (
        <div>
          {sortedPolls.map(poll => (
            <PollCard key={poll.id} poll={poll} showResults={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PollResults;