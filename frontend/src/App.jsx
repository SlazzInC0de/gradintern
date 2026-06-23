import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

// Our last remaining cardboard placeholder for Step 4!
const PostJob = () => <div className="p-20 text-center font-bold text-xl text-slate-600">📢 Post a Job Form (Coming Next)</div>;

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-job" element={<PostJob />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}