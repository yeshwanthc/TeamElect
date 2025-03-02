import React, { useState } from 'react';
import { Poll } from '../types';
import { useVoting } from '../context/VotingContext';
import { CheckCircle, AlertCircle, BarChart3, RotateCcw, ThumbsUp, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PollCardProps {
  poll: Poll;
  showResults?: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, showResults = false }) => {
  const { vote, removeVote, currentUser, togglePollStatus, deletePoll } = useVoting();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasVoted = currentUser ? poll.id in currentUser.votedPolls : false;
  const userVotedOption = hasVoted ? currentUser?.votedPolls[poll.id] : null;
  const isAdmin = currentUser?.isAdmin || false;
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  const handleVote = (optionId: string) => {
    vote(poll.id, optionId);
    toast.success('Your vote has been recorded!');
  };

  const handleRemoveVote = () => {
    removeVote(poll.id);
    toast.success('Your vote has been removed');
  };

  const handleDeletePoll = () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      deletePoll(poll.id);
      toast.success('Poll deleted successfully');
    }
  };

  const handleToggleStatus = () => {
    togglePollStatus(poll.id);
    toast.success(`Poll ${poll.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No end date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isPollEnded = poll.endDate ? new Date() > new Date(poll.endDate) : false;
  const canVote = poll.isActive && !isPollEnded && currentUser;
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!poll.endDate) return null;
    const today = new Date();
    const endDate = new Date(poll.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{poll.title}</h3>
          <div className="flex items-center">
            {poll.isActive ? (
              <span className="flex items-center text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle size={14} className="mr-1" /> Active
              </span>
            ) : (
              <span className="flex items-center text-red-600 text-sm bg-red-50 px-2 py-1 rounded-full">
                <AlertCircle size={14} className="mr-1" /> Inactive
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{poll.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4 text-sm">
          <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            <BarChart3 size={14} className="mr-1" /> 
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </div>
          
          <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            <Calendar size={14} className="mr-1" />
            {formatDate(poll.endDate)}
          </div>
          
          {daysRemaining !== null && daysRemaining > 0 && (
            <div className={`flex items-center px-2 py-1 rounded-full ${
              daysRemaining <= 3 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <span>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left</span>
            </div>
          )}
          
          {poll.options.some(option => option.votedBy.length > 0) && (
            <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <Users size={14} className="mr-1" />
              {new Set(poll.options.flatMap(option => option.votedBy)).size} participants
            </div>
          )}
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
                      <span className={isUserVote ? "font-medium text-blue-700 flex items-center" : ""}>
                        {option.text} {isUserVote && <ThumbsUp size={14} className="ml-1" />}
                      </span>
                      <span className="text-gray-600">{option.votes} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className={`h-2.5 rounded-full ${isUserVote ? 'bg-blue-600' : 'bg-gray-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => handleVote(option.id)}
                    disabled={!canVote}
                    className="w-full text-left p-2 border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.text}
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>

        {!currentUser && (
          <div className="text-sm text-gray-500 italic mb-4 bg-gray-50 p-2 rounded border border-gray-200">
            Please log in to vote
          </div>
        )}

        {hasVoted && !showResults && canVote && (
          <div className="flex items-center mb-4">
            <span className="text-sm text-green-600 italic mr-2">
              You have voted on this poll
            </span>
            <motion.button
              onClick={handleRemoveVote}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={14} className="mr-1" /> Remove vote
            </motion.button>
          </div>
        )}

        {isPollEnded && (
          <div className="text-sm text-red-600 italic mb-4 bg-red-50 p-2 rounded border border-red-100">
            This poll has ended
          </div>
        )}

        {isAdmin && (
          <motion.div 
            className="flex space-x-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handleToggleStatus}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {poll.isActive ? 'Deactivate' : 'Activate'}
            </motion.button>
            <motion.button
              onClick={handleDeletePoll}
              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </motion.button>
          </motion.div>
        )}
        
        {poll.options.length > 3 && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Show less' : 'Show more details'}
            </button>
          </div>
        )}
        
        {isExpanded && (
          <motion.div 
            className="mt-4 pt-4 border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-gray-600">
              <p><strong>Created by:</strong> {poll.createdBy}</p>
              <p><strong>Created on:</strong> {new Date(poll.createdAt).toLocaleDateString()}</p>
              <p><strong>Total participants:</strong> {new Set(poll.options.flatMap(option => option.votedBy)).size}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PollCard;