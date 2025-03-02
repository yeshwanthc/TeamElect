import React, { useState, useEffect } from 'react';
import { useVoting } from '../context/VotingContext';
import PollList from '../components/PollList';
import CreatePollForm from '../components/CreatePollForm';
import UserLogin from '../components/UserLogin';
import PollResults from '../components/PollResults';
import FeedbackForm from '../components/FeedbackForm';
import Toast from '../components/Toast';
import { VoteIcon, PlusCircle, BarChart3, MessageSquare, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { currentUser, polls } = useVoting();
  const [activeTab, setActiveTab] = useState<'polls' | 'create' | 'results' | 'feedback'>('polls');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing tabs
  const handleTabChange = (tab: 'polls' | 'create' | 'results' | 'feedback') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Get active polls count
  const activePolls = polls.filter(poll => 
    poll.isActive && (!poll.endDate || new Date(poll.endDate) > new Date())
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      
      <header className={`sticky top-0 z-10 transition-all duration-300 ${
        isScrolled ? 'bg-blue-700 shadow-md' : 'bg-blue-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <VoteIcon size={28} className="mr-3 text-white" />
              <h1 className="text-2xl font-bold text-white">TeamElect</h1>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-1"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar for larger screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              <UserLogin />
              
              {currentUser && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <nav className="flex flex-col">
                    <button
                      onClick={() => handleTabChange('polls')}
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === 'polls' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <VoteIcon size={18} className="mr-2" />
                      <span>All Polls</span>
                      <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {polls.length}
                      </span>
                    </button>
                    
                    {currentUser.isAdmin && (
                      <button
                        onClick={() => handleTabChange('create')}
                        className={`flex items-center px-4 py-3 text-left ${
                          activeTab === 'create' 
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <PlusCircle size={18} className="mr-2" />
                        <span>Create Poll</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleTabChange('results')}
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === 'results' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <BarChart3 size={18} className="mr-2" />
                      <span>Results</span>
                    </button>
                    
                    <button
                      onClick={() => handleTabChange('feedback')}
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === 'feedback' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <MessageSquare size={18} className="mr-2" />
                      <span>Feedback</span>
                    </button>
                  </nav>
                </div>
              )}
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-sm text-gray-600">
                  This internal voting system allows company employees to create and participate in polls.
                  Login to cast your votes on important company decisions.
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                 
                </div>
              </div>
              
              {currentUser && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white">
                  <h3 className="font-medium mb-2">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Polls:</span>
                      <span className="font-bold">{polls.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Polls:</span>
                      <span className="font-bold">{activePolls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Votes:</span>
                      <span className="font-bold">{Object.keys(currentUser.votedPolls).length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="fixed inset-0 bg-gray-800 bg-opacity-75 z-20 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-30"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <VoteIcon size={24} className="mr-2 text-blue-600" />
                        <h2 className="text-xl font-bold">Menu</h2>
                      </div>
                      <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-1 text-gray-500"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <UserLogin />
                    
                    {currentUser && (
                      <nav className="mt-4 flex flex-col space-y-1">
                        <button
                          onClick={() => handleTabChange('polls')}
                          className={`flex items-center px-4 py-3 text-left rounded ${
                            activeTab === 'polls' 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <VoteIcon size={18} className="mr-2" />
                          <span>All Polls</span>
                        </button>
                        
                        {currentUser.isAdmin && (
                          <button
                            onClick={() => handleTabChange('create')}
                            className={`flex items-center px-4 py-3 text-left rounded ${
                              activeTab === 'create' 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <PlusCircle size={18} className="mr-2" />
                            <span>Create Poll</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleTabChange('results')}
                          className={`flex items-center px-4 py-3 text-left rounded ${
                            activeTab === 'results' 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <BarChart3 size={18} className="mr-2" />
                          <span>Results</span>
                        </button>
                        
                        <button
                          onClick={() => handleTabChange('feedback')}
                          className={`flex items-center px-4 py-3 text-left rounded ${
                            activeTab === 'feedback' 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <MessageSquare size={18} className="mr-2" />
                          <span>Feedback</span>
                        </button>
                      </nav>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile sidebar for small screens */}
          <div className="lg:hidden col-span-1 mb-4">
            <UserLogin />
          </div>
          
          {/* Main content */}
          <div className="col-span-1 lg:col-span-3">
            {!currentUser ? (
              <motion.div 
                className="bg-white rounded-lg shadow-md p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <VoteIcon size={40} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-4">Welcome to the TeamElect</h2>
                  <p className="text-gray-600 mb-6">Please log in to participate in polls and see results.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2 text-blue-700">Vote on Polls</h3>
                    <p className="text-sm text-gray-600">Cast your vote on important company decisions and make your voice heard.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2 text-blue-700">View Results</h3>
                    <p className="text-sm text-gray-600">See real-time results and analytics for all company polls.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2 text-blue-700">Submit Feedback</h3>
                    <p className="text-sm text-gray-600">Share your ideas to help improve our voting system.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'polls' && <PollList />}
                  {activeTab === 'create' && <CreatePollForm />}
                  {activeTab === 'results' && <PollResults />}
                  {activeTab === 'feedback' && <FeedbackForm />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} TeamElect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;