import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Calendar, Building } from 'lucide-react';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/listings')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch jobs:", err));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh] text-slate-400 font-medium">Loading Marketplace...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Available Internships</h1>
        <p className="text-slate-500 mt-1 text-lg">Apply for entry-level tech roles posted directly by verified recruiters.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1 rounded-full border border-indigo-100">
                  {job.company}
                </span>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h2>
              
              <p className="text-slate-600 text-sm mt-2.5 leading-relaxed line-clamp-3">
                {job.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-y-2 items-center justify-between text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                <DollarSign className="h-3.5 w-3.5" />
                <span>{job.salary || 'Unpaid / Stipend'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}