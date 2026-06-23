import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-black text-xl text-indigo-600 tracking-wider">
              <Briefcase className="h-6 w-6" />
              <span>GRADINTERN</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-slate-600 hidden sm:inline">
                  Hi, <strong className="text-slate-900">{user.name}</strong> ({user.role})
                </span>
                
                {user.role === 'recruiter' && (
                  <Link
                    to="/post-job"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
                  >
                    Post a Job
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}