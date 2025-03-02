import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { LogIn, LogOut, User, AlertCircle, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const UserLogin: React.FC = () => {
  const { currentUser, login, logout } = useVoting();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!employeeId.trim()) {
      setError('Please enter your Employee ID');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    
    setIsLoggingIn(true);
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      const success = login(employeeId, password);
      if (success) {
        toast.success('Logged in successfully');
      } else {
        setError('Invalid credentials. Please try again.');
        toast.error('Login failed');
      }
      setIsLoggingIn(false);
    }, 600);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {currentUser ? (
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Employee ID: {currentUser.id}</h3>
              <p className="text-sm text-gray-600">{currentUser.isAdmin ? 'Administrator' : 'Employee'}</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={16} className="mr-2" /> Logout
          </motion.button>
        </div>
      ) : (
        <div>
          <div className="bg-blue-600 text-white p-4">
            <h3 className="font-medium text-lg flex items-center">
              <Key size={18} className="mr-2" /> Login to Vote
            </h3>
          </div>
          
          <form onSubmit={handleLogin} className="p-4">
            {error && (
              <motion.div 
                className="mb-3 p-2 bg-red-50 text-red-600 rounded flex items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
            
            <div className="mb-3">
              <label htmlFor="employeeId" className="block text-sm text-gray-600 mb-1">
                Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter your ID (e.g., 1001 or admin)"
                  className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={16} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
             
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-70 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={16} className="mr-2" /> Login
                </>
              )}
            </motion.button>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default UserLogin;