import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { MapPin, DollarSign, Calendar, Loader2, AlertCircle, FolderOpen } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/listings`);
        if (!res.ok) throw new Error('Failed to retrieve active telemetry from Atlas cluster');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // =========================================================
  // 📍 THE "POCKET": Derived Telemetry (Calculated instantly)
  // =========================================================
  const totalJobs = jobs.length;
  const uniquePartners = new Set(jobs.map(item => item.company)).size;
  const remoteCount = jobs.filter(item => 
    item.location?.toLowerCase().includes('remote') || 
    item.location?.toLowerCase().includes('hybrid')
  ).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Querying Atlas Cluster...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Available Internships</h1>
        <p className="text-slate-500 text-sm mt-1">Apply for entry-level tech roles posted directly by verified recruiters.</p>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="mt-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center gap-3 text-rose-700 text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 📊 LIVE CLUSTER TELEMETRY BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col items-center justify-center p-2 border-r border-slate-100 last:border-0">
          <span className="text-3xl font-black text-indigo-600">{totalJobs}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Active Roles</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border-r border-slate-100 last:border-0">
          <span className="text-3xl font-black text-indigo-600">{uniquePartners}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Enterprise Partners</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 border-r border-slate-100 last:border-0">
          <span className="text-3xl font-black text-indigo-600">{remoteCount}</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Hybrid / Remote</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Cluster Status</span>
        </div>
      </div>

      {/* CONTENT FEED */}
      {jobs.length === 0 ? (
        /* ZERO DATA STATE */
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm my-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">The Marketplace is Quiet</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            No enterprise recruiters have deployed active internship opportunities to the cluster yet.
          </p>
          {user?.role === 'recruiter' && (
            <Link 
              to="/post-job" 
              className="mt-6 inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-md"
            >
              Deploy the First Listing
            </Link>
          )}
        </div>
      ) : (
        /* ACTIVE LISTINGS GRID */
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
              <div>
                {/* Top Row: Company Badge & Date */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black tracking-wider uppercase">
                    {job.company}
                  </span>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(job.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Job Title */}
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                  {job.title}
                </h2>

                {/* Job Spec / Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {job.description}
                </p>
              </div>

              {/* Bottom Divider & Meta Row */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black tracking-wide flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {job.salary}
                  </span>
                  
                  <button 
                    onClick={() => alert(`Application packet initialized for ${job.title} at ${job.company}. (Stateless JWT payload attached)`)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}