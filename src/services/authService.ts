// Authentication Service

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  mobile: string;
  email?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  token?: string;
}

const STORAGE_KEY = 'auth_user';
const SESSION_KEY = 'auth_session';

// Mock authentication service
export const authService = {
  // Login user
  login: async (username: string, password: string): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock user data (in production, this would come from backend)
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      const userSession = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        mobile: user.mobile,
        email: user.email,
        createdAt: user.createdAt
      };

      // Store session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
      localStorage.setItem(SESSION_KEY, 'authenticated');

      return {
        success: true,
        user: userSession,
        message: 'Login successful',
        token: `mock_token_${Date.now()}`
      };
    }

    return {
      success: false,
      message: 'Invalid username or password'
    };
  },

  // Register new user
  register: async (userData: {
    firstName: string;
    lastName: string;
    username: string;
    mobile: string;
    password: string;
  }): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Check if username or mobile already exists
    const existingUser = users.find((u: any) => 
      u.username === userData.username || u.mobile === userData.mobile
    );

    if (existingUser) {
      return {
        success: false,
        message: 'Username or mobile number already exists'
      };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(users));

    return {
      success: true,
      message: 'Registration successful. You can now login.',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        mobile: newUser.mobile,
        createdAt: newUser.createdAt
      }
    };
  },

  // Get current user
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEY);
      const session = localStorage.getItem(SESSION_KEY);
      
      if (userStr && session === 'authenticated') {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const session = localStorage.getItem(SESSION_KEY);
    const user = localStorage.getItem(STORAGE_KEY);
    return session === 'authenticated' && !!user;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  // Send OTP to mobile number
  sendOTP: async (mobile: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate mobile number format (Indian)
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(mobile)) {
      return {
        success: false,
        message: 'Invalid mobile number. Please enter a valid Indian mobile number.'
      };
    }

    // In production, this would integrate with SMS service like Fast2SMS
    const otp = '123456'; // Mock OTP for demo

    return {
      success: true,
      message: 'OTP sent successfully to your mobile number.',
      otp: otp // In production, this would not be returned
    };
  },

  // Verify OTP
  verifyOTP: async (mobile: string, otp: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, accept 123456 as valid OTP
    if (otp === '123456') {
      return {
        success: true,
        message: 'OTP verified successfully.'
      };
    }

    return {
      success: false,
      message: 'Invalid OTP. Please try again.'
    };
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Also update in registered users
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('registered_users', JSON.stringify(users));
    }

    return {
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    };
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Get users and verify current password
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    
    if (userIndex === -1 || users[userIndex].password !== currentPassword) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('registered_users', JSON.stringify(users));

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }
};