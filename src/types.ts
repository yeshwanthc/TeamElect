export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdBy: string;
  createdAt: Date;
  endDate: Date | null;
  isActive: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votedBy: string[]; // Array of user IDs who voted for this option
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  votedPolls: Record<string, string>; // Map of pollId to optionId
  isAdmin: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
}