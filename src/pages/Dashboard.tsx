import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import PollList from '../components/PollList';
import CreatePollForm from '../components/CreatePollForm';
import UserLogin from '../components/UserLogin';
import PollResults from '../components/PollResults';
import FeedbackForm from '../components/FeedbackForm';
import { VoteIcon, PlusCircle, BarChart3, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser } = useVoting();
  const [activeTab, setActiveTab] = useState<'polls' | 'create' | 'results' | 'feedback'>('polls');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <VoteIcon size={28} className="mr-3" />
              <h1 className="text-2xl font-bold">TeamElect</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <UserLogin />
              
              {currentUser && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <nav className="flex flex-col">
                    <button
                      onClick={() => setActiveTab('polls')}
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === 'polls' 
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <VoteIcon size={18} className="mr-2" />
                      <span>All Polls</span>
                    </button>
                    
                    {currentUser.isAdmin && (
                      <button
                        onClick={() => setActiveTab('create')}
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
                      onClick={() => setActiveTab('results')}
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
                      onClick={() => setActiveTab('feedback')}
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
           
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {!currentUser ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Welcome to the TeamElect</h2>
                <p className="text-gray-600 mb-6">Please log in to participate in polls and see results.</p>
              </div>
            ) : (
              <>
                {activeTab === 'polls' && <PollList />}
                {activeTab === 'create' && <CreatePollForm />}
                {activeTab === 'results' && <PollResults />}
                {activeTab === 'feedback' && <FeedbackForm />}
              </>
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