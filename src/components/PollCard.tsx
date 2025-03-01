import React from 'react';
import { Poll } from '../types';
import { useVoting } from '../context/VotingContext';
import { CheckCircle, AlertCircle, BarChart3, RotateCcw } from 'lucide-react';

interface PollCardProps {
  poll: Poll;
  showResults?: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, showResults = false }) => {
  const { vote, removeVote, currentUser, togglePollStatus, deletePoll } = useVoting();
  
  const hasVoted = currentUser ? poll.id in currentUser.votedPolls : false;
  const userVotedOption = hasVoted ? currentUser?.votedPolls[poll.id] : null;
  const isAdmin = currentUser?.isAdmin || false;
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  const handleVote = (optionId: string) => {
    vote(poll.id, optionId);
  };

  const handleRemoveVote = () => {
    removeVote(poll.id);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No end date';
    return new Date(date).toLocaleDateString();
  };

  const isPollEnded = poll.endDate ? new Date() > new Date(poll.endDate) : false;
  const canVote = poll.isActive && !isPollEnded && currentUser;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{poll.title}</h3>
        <div className="flex items-center">
          {poll.isActive ? (
            <span className="flex items-center text-green-600 text-sm">
              <CheckCircle size={16} className="mr-1" /> Active
            </span>
          ) : (
            <span className="flex items-center text-red-600 text-sm">
              <AlertCircle size={16} className="mr-1" /> Inactive
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{poll.description}</p>
      
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <BarChart3 size={16} className="mr-1" /> 
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </div>
        <div className="text-sm text-gray-500">
          Ends: {formatDate(poll.endDate)}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {poll.options.map(option => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isUserVote = userVotedOption === option.id;
          
          return (
            <div key={option.id} className="relative">
              {(showResults || hasVoted || !canVote) ? (
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className={isUserVote ? "font-medium text-blue-700" : ""}>
                      {option.text} {isUserVote && "✓"}
                    </span>
                    <span className="text-gray-600">{option.votes} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${isUserVote ? 'bg-blue-600' : 'bg-gray-400'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={!canVote}
                  className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option.text}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!currentUser && (
        <div className="text-sm text-gray-500 italic mb-4">
          Please log in to vote
        </div>
      )}

      {hasVoted && !showResults && canVote && (
        <div className="flex items-center mb-4">
          <span className="text-sm text-green-600 italic mr-2">
            You have voted on this poll
          </span>
          <button
            onClick={handleRemoveVote}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RotateCcw size={14} className="mr-1" /> Remove vote
          </button>
        </div>
      )}

      {isPollEnded && (
        <div className="text-sm text-red-600 italic mb-4">
          This poll has ended
        </div>
      )}

      {isAdmin && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => togglePollStatus(poll.id)}
            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            {poll.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => deletePoll(poll.id)}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PollCard;