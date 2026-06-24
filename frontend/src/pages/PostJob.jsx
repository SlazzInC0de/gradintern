import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config'; // Importing our new bridge!
import { Briefcase, Building, MapPin, DollarSign, FileText, Loader2, AlertCircle } from 'lucide-react';

export default function PostJob() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // THE BOUNCER: Kick non-recruiters out instantly
  if (!user || user.role !== 'recruiter') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="p-8 bg-rose-50 border-2 border-rose-200 rounded-2xl max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3 animate-bounce" />
          <h3 className="font-black text-slate-900 text-lg">Recruiter Access Required</h3>
          <p className="text-slate-600 text-xs mt-1">Your current session is registered as a Student ID. You do not possess listing authorization.</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    company: user.company || '', // Auto-fill their company if stored!
    location: '',
    salary: '',
    type: 'Internship',
    description: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // PASSING THE VIP WRISTBAND TO EXPRESS!
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to post listing');

      // Success! Teleport the recruiter to the home board to view their creation
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Deploy a New Opportunity</h1>
          <p className="text-slate-500 text-xs mt-1">Broadcast your internship to verified MIT Bengaluru graduates.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg flex items-center gap-3 text-rose-700 text-sm font-medium">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Role Title</label>
              <div className="relative">
                <Briefcase className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Junior AI Researcher"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Organization</label>
              <div className="relative">
                <Building className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. Google Cloud"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Bengaluru / Remote"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Stipend / Salary</label>
              <div className="relative">
                <DollarSign className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  placeholder="₹45,000 / month"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Engagement</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
              >
                <option>Internship</option>
                <option>Full-Time</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Requirements & Spec</label>
            <div className="relative">
              <FileText className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="List required skills, tech stack, and sprint expectations..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Publish Opportunity to Live Feed</span>}
          </button>
        </form>
      </div>
    </div>
  );
}