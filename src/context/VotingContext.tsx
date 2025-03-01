import React, { createContext, useContext, useState, useEffect } from 'react';
import { Poll, PollOption, User, Feedback } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface VotingContextType {
  polls: Poll[];
  currentUser: User | null;
  feedback: Feedback[];
  createPoll: (title: string, description: string, options: string[], endDate: Date | null) => void;
  vote: (pollId: string, optionId: string) => void;
  removeVote: (pollId: string) => void;
  deletePoll: (pollId: string) => void;
  togglePollStatus: (pollId: string) => void;
  login: (employeeId: string, password: string) => boolean;
  logout: () => void;
  submitFeedback: (message: string) => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

// Mock data
const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Office Location',
    description: 'Where should our new office be located?',
    options: [
      { id: '1-1', text: 'Bangalore', votes: 5, votedBy: ['1001', '1003'] },
      { id: '1-2', text: 'Mumbai', votes: 3, votedBy: ['1002'] },
      { id: '1-3', text: 'Hyderabad', votes: 8, votedBy: ['1004', '1005'] },
    ],
    createdBy: 'admin',
    createdAt: new Date('2025-01-15'),
    endDate: new Date('2025-06-30'),
    isActive: true,
  },
  {
    id: '2',
    title: 'Company Retreat',
    description: 'Where should we go for our annual retreat?',
    options: [
      { id: '2-1', text: 'Goa Beaches', votes: 12, votedBy: ['1001', '1002'] },
      { id: '2-2', text: 'Kerala Backwaters', votes: 15, votedBy: ['1003', '1004'] },
      { id: '2-3', text: 'Himachal Mountains', votes: 7, votedBy: ['1005'] },
    ],
    createdBy: 'admin',
    createdAt: new Date('2025-02-10'),
    endDate: new Date('2025-05-15'),
    isActive: true,
  },
  {
    id: '3',
    title: 'Anniversary Sports Event',
    description: 'Which sport should be conducted on company anniversary?',
    options: [
      { id: '3-1', text: 'Cricket Tournament', votes: 18, votedBy: ['1001', '1002', '1003'] },
      { id: '3-2', text: 'Football Match', votes: 10, votedBy: ['1004'] },
      { id: '3-3', text: 'Badminton Championship', votes: 5, votedBy: ['1005'] },
      { id: '3-4', text: 'Carrom Competition', votes: 7, votedBy: [] },
    ],
    createdBy: 'admin',
    createdAt: new Date('2025-03-05'),
    endDate: new Date('2025-04-20'),
    isActive: true,
  }
];

const mockUsers: User[] = [
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@company.com',
    department: 'Management',
    votedPolls: {
      '2': '2-1',
      '3': '3-1'
    },
    isAdmin: true
  },
  {
    id: '1001',
    name: 'Rahul Sharma',
    email: 'rahul@company.com',
    department: 'Engineering',
    votedPolls: {
      '1': '1-1',
      '2': '2-1',
      '3': '3-1'
    },
    isAdmin: false
  },
  {
    id: '1002',
    name: 'Priya Patel',
    email: 'priya@company.com',
    department: 'Marketing',
    votedPolls: {
      '1': '1-2',
      '2': '2-1',
      '3': '3-1'
    },
    isAdmin: false
  },
  {
    id: '1003',
    name: 'Amit Kumar',
    email: 'amit@company.com',
    department: 'Finance',
    votedPolls: {
      '1': '1-1',
      '2': '2-2',
      '3': '3-1'
    },
    isAdmin: false
  },
  {
    id: '1004',
    name: 'Sneha Gupta',
    email: 'sneha@company.com',
    department: 'HR',
    votedPolls: {
      '1': '1-3',
      '2': '2-2',
      '3': '3-2'
    },
    isAdmin: false
  },
  {
    id: '1005',
    name: 'Vikram Singh',
    email: 'vikram@company.com',
    department: 'Operations',
    votedPolls: {
      '1': '1-3',
      '2': '2-3',
      '3': '3-3'
    },
    isAdmin: false
  }
];

const mockFeedback: Feedback[] = [
  {
    id: '1',
    userId: '1001',
    message: 'Could we have more options for sports events?',
    createdAt: new Date('2025-03-10')
  },
  {
    id: '2',
    userId: '1003',
    message: 'The voting system is great, but it would be nice to have notifications when new polls are created.',
    createdAt: new Date('2025-03-12')
  }
];

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [polls, setPolls] = useState<Poll[]>(() => {
    const savedPolls = localStorage.getItem('polls');
    return savedPolls ? JSON.parse(savedPolls) : mockPolls;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : mockUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [feedback, setFeedback] = useState<Feedback[]>(() => {
    const savedFeedback = localStorage.getItem('feedback');
    return savedFeedback ? JSON.parse(savedFeedback) : mockFeedback;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('feedback', JSON.stringify(feedback));
  }, [feedback]);

  const createPoll = (title: string, description: string, options: string[], endDate: Date | null) => {
    if (!currentUser || !currentUser.isAdmin) return;
    
    const newPoll: Poll = {
      id: uuidv4(),
      title,
      description,
      options: options.map(option => ({
        id: uuidv4(),
        text: option,
        votes: 0,
        votedBy: []
      })),
      createdBy: currentUser.id,
      createdAt: new Date(),
      endDate,
      isActive: true,
    };

    setPolls(prevPolls => [...prevPolls, newPoll]);
  };

  const vote = (pollId: string, optionId: string) => {
    if (!currentUser) return;

    // Check if user has already voted on this poll
    const previousVote = currentUser.votedPolls[pollId];
    
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => {
              // If user previously voted for a different option, decrement that vote
              if (previousVote && option.id === previousVote) {
                return { 
                  ...option, 
                  votes: option.votes - 1,
                  votedBy: option.votedBy.filter(id => id !== currentUser.id)
                };
              }
              // Add vote to the new option
              if (option.id === optionId) {
                return { 
                  ...option, 
                  votes: option.votes + 1,
                  votedBy: [...option.votedBy, currentUser.id]
                };
              }
              return option;
            }),
          };
        }
        return poll;
      })
    );

    // Update user's voted polls
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === currentUser.id) {
          const updatedVotedPolls = {...user.votedPolls};
          updatedVotedPolls[pollId] = optionId;
          
          return {
            ...user,
            votedPolls: updatedVotedPolls,
          };
        }
        return user;
      })
    );

    // Update current user
    setCurrentUser(prevUser => {
      if (prevUser) {
        const updatedVotedPolls = {...prevUser.votedPolls};
        updatedVotedPolls[pollId] = optionId;
        
        return {
          ...prevUser,
          votedPolls: updatedVotedPolls,
        };
      }
      return prevUser;
    });
  };

  const removeVote = (pollId: string) => {
    if (!currentUser) return;

    const optionId = currentUser.votedPolls[pollId];
    if (!optionId) return; // User hasn't voted on this poll

    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => {
              if (option.id === optionId) {
                return { 
                  ...option, 
                  votes: option.votes - 1,
                  votedBy: option.votedBy.filter(id => id !== currentUser.id)
                };
              }
              return option;
            }),
          };
        }
        return poll;
      })
    );

    // Update user's voted polls
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === currentUser.id) {
          const updatedVotedPolls = {...user.votedPolls};
          delete updatedVotedPolls[pollId];
          
          return {
            ...user,
            votedPolls: updatedVotedPolls,
          };
        }
        return user;
      })
    );

    // Update current user
    setCurrentUser(prevUser => {
      if (prevUser) {
        const updatedVotedPolls = {...prevUser.votedPolls};
        delete updatedVotedPolls[pollId];
        
        return {
          ...prevUser,
          votedPolls: updatedVotedPolls,
        };
      }
      return prevUser;
    });
  };

  const deletePoll = (pollId: string) => {
    if (!currentUser || !currentUser.isAdmin) return;
    
    setPolls(prevPolls => prevPolls.filter(poll => poll.id !== pollId));
  };

  const togglePollStatus = (pollId: string) => {
    if (!currentUser || !currentUser.isAdmin) return;
    
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return { ...poll, isActive: !poll.isActive };
        }
        return poll;
      })
    );
  };

  const login = (employeeId: string, password: string): boolean => {
    // Admin login
    if (employeeId === 'admin' && password === '123') {
      const adminUser = users.find(u => u.id === 'admin');
      if (adminUser) {
        setCurrentUser(adminUser);
        return true;
      }
    }
    
    // Employee login - 4 digit ID and password 321
    if (/^\d{4}$/.test(employeeId) && password === '321') {
      // Check if user exists
      let user = users.find(u => u.id === employeeId);
      
      // If user doesn't exist but ID is between 1001-1200, create a new user
      if (!user && parseInt(employeeId) >= 1001 && parseInt(employeeId) <= 1200) {
        user = {
          id: employeeId,
          name: `Employee ${employeeId}`,
          email: `${employeeId}@company.com`,
          department: 'General',
          votedPolls: {},
          isAdmin: false
        };
        
        setUsers(prevUsers => [...prevUsers, user!]);
      }
      
      if (user) {
        setCurrentUser(user);
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const submitFeedback = (message: string) => {
    if (!currentUser || !message.trim()) return;
    
    const newFeedback: Feedback = {
      id: uuidv4(),
      userId: currentUser.id,
      message: message.trim(),
      createdAt: new Date()
    };
    
    setFeedback(prev => [...prev, newFeedback]);
  };

  return (
    <VotingContext.Provider
      value={{
        polls,
        currentUser,
        feedback,
        createPoll,
        vote,
        removeVote,
        deletePoll,
        togglePollStatus,
        login,
        logout,
        submitFeedback
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};