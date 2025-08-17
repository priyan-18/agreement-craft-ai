// Debug utility to clear test data if needed
export const clearTestData = () => {
  localStorage.removeItem('registered_users');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_session');
  console.log('Test data cleared');
};

// Add this function to the window for easy access in dev tools
if (typeof window !== 'undefined') {
  (window as any).clearTestData = clearTestData;
}