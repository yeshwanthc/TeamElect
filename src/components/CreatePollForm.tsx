import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { Plus, Minus, AlertCircle, Check, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CreatePollForm: React.FC = () => {
  const { createPoll, currentUser } = useVoting();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);
    
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
    
    // Create end date with time if provided
    let finalEndDate = null;
    if (endDate) {
      finalEndDate = new Date(endDate);
      
      if (endTime) {
        const [hours, minutes] = endTime.split(':').map(Number);
        finalEndDate.setHours(hours, minutes);
      }
    }
    
    // Create the poll
    createPoll(
      title,
      description,
      options,
      finalEndDate
    );
    
    // Show success message
    toast.success('Poll created successfully!');
    setSuccess(true);
    
    // Reset form
    setTitle('');
    setDescription('');
    setOptions(['', '']);
    setEndDate('');
    setEndTime('');
    setIsSubmitting(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  if (!isAdmin) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
          <p className="text-gray-600">
            Only administrators can create new polls. Please contact your system administrator if you need to create a poll.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">Create New Poll</h2>
      
      {error && (
        <motion.div 
          className="mb-4 p-3 bg-red-50 text-red-600 rounded flex items-start"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          className="mb-4 p-3 bg-green-50 text-green-600 rounded flex items-start"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Check size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>Poll created successfully!</span>
        </motion.div>
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
            <motion.div 
              key={index} 
              className="flex items-center mb-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
                required
              />
              <motion.button
                type="button"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
                className="ml-2 p-1 text-red-500 hover:bg-red-100 rounded disabled:opacity-30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus size={18} />
              </motion.button>
            </motion.div>
          ))}
          <motion.button
            type="button"
            onClick={handleAddOption}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} className="mr-1" /> Add Option
          </motion.button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-9 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative flex-1">
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Clock size={16} />
              </div>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pl-9 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!endDate}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Leave blank for no end date</p>
        </div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreatePollForm;