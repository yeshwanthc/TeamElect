import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import PollCard from './PollCard';
import { BarChart, PieChart, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PollResults: React.FC = () => {
  const { polls } = useVoting();
  const [expandedPoll, setExpandedPoll] = useState<string | null>(null);

  // Sort polls by total votes (descending)
  const sortedPolls = [...polls].sort((a, b) => {
    const votesA = a.options.reduce((sum, option) => sum + option.votes, 0);
    const votesB = b.options.reduce((sum, option) => sum + option.votes, 0);
    return votesB - votesA;
  });

  // Get top 5 polls by votes
  const topPolls = sortedPolls.slice(0, 5);

  // Prepare data for the top polls chart
  const topPollsChartData = {
    labels: topPolls.map(poll => poll.title),
    datasets: [
      {
        label: 'Total Votes',
        data: topPolls.map(poll => poll.options.reduce((sum, option) => sum + option.votes, 0)),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Toggle expanded poll
  const toggleExpandedPoll = (pollId: string) => {
    if (expandedPoll === pollId) {
      setExpandedPoll(null);
    } else {
      setExpandedPoll(pollId);
    }
  };

  // Get poll chart data
  const getPollChartData = (poll: typeof sortedPolls[0]) => {
    return {
      labels: poll.options.map(option => option.text),
      datasets: [
        {
          label: 'Votes',
          data: poll.options.map(option => option.votes),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <BarChart size={20} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold">Poll Results</h2>
      </div>

      {sortedPolls.length === 0 ? (
        <motion.div 
          className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500">No polls available</p>
        </motion.div>
      ) : (
        <div>
          <motion.div 
            className="mb-8 bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">Top 5 Most Voted Polls</h3>
            <div className="h-64 md:h-80">
              <Bar 
                data={topPollsChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          <div className="space-y-6">
            {sortedPolls.map((poll, index) => (
              <motion.div 
                key={poll.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{poll.title}</h3>
                    <button 
                      onClick={() => toggleExpandedPoll(poll.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedPoll === poll.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <div className="space-y-3">
                        {poll.options.map(option => {
                          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                          
                          return (
                            <div key={option.id} className="relative">
                              <div className="mb-2">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{option.text}</span>
                                  <span className="text-gray-600">{option.votes} ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <motion.div 
                                    className="h-2.5 rounded-full bg-blue-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                  ></motion.div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 flex justify-center items-center">
                      <div className="h-48 w-48">
                        <Pie 
                          data={getPollChartData(poll)} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right',
                                labels: {
                                  boxWidth: 12,
                                  font: {
                                    size: 10
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedPoll === poll.id && (
                      <motion.div 
                        className="mt-6 pt-4 border-t border-gray-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PollCard poll={poll} showResults={true} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollResults;