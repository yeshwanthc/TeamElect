import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { MessageSquare, Send, AlertCircle } from 'lucide-react';

const FeedbackForm: React.FC = () => {
  const { submitFeedback, currentUser } = useVoting();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!currentUser) {
      setError('Please log in to submit feedback');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter your feedback message');
      return;
    }
    
    setIsSubmitting(true);
    submitFeedback(message);
    setMessage('');
    setSuccess(true);
    setIsSubmitting(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <MessageSquare size={20} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold">Feedback</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Help us improve the voting system by sharing your ideas and suggestions.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded">
          Thank you for your feedback! Your message has been submitted.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            id="feedback"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Share your ideas to improve our voting system..."
            disabled={!currentUser}
          />
          {!currentUser && (
            <p className="text-xs text-red-500 mt-1">Please log in to submit feedback</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !currentUser}
          className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <Send size={16} className="mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;