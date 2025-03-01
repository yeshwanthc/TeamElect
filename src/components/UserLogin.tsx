import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { LogIn, LogOut, User, AlertCircle } from 'lucide-react';

const UserLogin: React.FC = () => {
  const { currentUser, login, logout } = useVoting();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    
    const success = login(employeeId, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {currentUser ? (
        <div>
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Employee ID: {currentUser.id}</h3>
              <p className="text-sm text-gray-600">{currentUser.isAdmin ? 'Administrator' : 'Employee'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h3 className="font-medium mb-3">Login to Vote</h3>
          
          {error && (
            <div className="mb-3 p-2 bg-red-50 text-red-600 rounded flex items-start">
              <AlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="employeeId" className="block text-sm text-gray-600 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter your Employee ID"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
     
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            <LogIn size={16} className="mr-2" /> Login
          </button>
        </form>
      )}
    </div>
  );
};

export default UserLogin;