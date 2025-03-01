import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { Plus, Minus, AlertCircle } from 'lucide-react';

const CreatePollForm: React.FC = () => {
  const { createPoll, currentUser } = useVoting();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = currentUser?.isAdmin || false;

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (options.some(option => !option.trim())) {
      setError('Please fill in all options');
      return;
    }
    
    if (new Set(options.map(o => o.trim())).size !== options.length) {
      setError('Options must be unique');
      return;
    }

    setIsSubmitting(true);
    
    // Create the poll
    createPoll(
      title,
      description,
      options,
      endDate ? new Date(endDate) : null
    );
    
    // Reset form
    setTitle('');
    setDescription('');
    setOptions(['', '']);
    setEndDate('');
    setIsSubmitting(false);
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
          <p className="text-gray-600">
            Only administrators can create new polls. Please contact your system administrator if you need to create a poll.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Poll</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options *
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
                className="ml-2 p-1 text-red-500 hover:bg-red-100 rounded disabled:opacity-30"
              >
                <Minus size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} className="mr-1" /> Add Option
          </button>
        </div>
        
        <div className="mb-6">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank for no end date</p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
};

export default CreatePollForm;