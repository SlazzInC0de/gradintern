import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the website boots up, look inside the browser's secret backpack (localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('gradintern_user');
    const storedToken = localStorage.getItem('gradintern_token');

    if (storedUser && storedToken) {
      setUser({ ...JSON.parse(storedUser), token: storedToken });
    }
    setLoading(false); // Finished checking the backpack!
  }, []);

  // Called when the Login API says "Success!"
  const login = (userData, token) => {
    localStorage.setItem('gradintern_user', JSON.stringify(userData));
    localStorage.setItem('gradintern_token', token);
    setUser({ ...userData, token });
  };

  // Called when user clicks "Sign Out"
  const logout = () => {
    localStorage.removeItem('gradintern_user');
    localStorage.removeItem('gradintern_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Senior Dev trick: A custom hook so our pages can just type `const { user } = useAuth()`
export const useAuth = () => useContext(AuthContext);