import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./components/SearchBar";
import AIAnalysis from "./components/AIAnalysis";
import { analyzeJob } from "./store/jobSlice";
import { Sparkles, MapPin, Bookmark, Trash2 } from "lucide-react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const dispatch = useDispatch();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [view, setView] = useState("search");
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "savedJobs"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsArr = [];
      const idsArr = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        jobsArr.push({ ...data, id: doc.id });
        idsArr.push(data.job_id);
      });
      setSavedJobs(jobsArr);
      setSavedJobIds(idsArr);
    });
    return () => unsubscribe();
  }, []);

  const { list, status, analysis, analysisStatus } = useSelector((state) => state.jobs);

  const handleOpenAnalysis = (title, description) => {
    setIsPanelOpen(true);
    dispatch(analyzeJob({ title, description }));
  };

  const handleSaveJob = async (job) => {
    try {
      await addDoc(collection(db, "savedJobs"), {
        ...job,
        status: "Applied", // Default status
        savedAt: new Date(),
      });
    } catch (e) {
      console.error("Error saving job: ", e);
    }
  };

  const handleDeleteJob = async (firebaseId) => {
    try {
      await deleteDoc(doc(db, "savedJobs", firebaseId));
    } catch (e) {
      console.error("Error deleting job: ", e);
    }
  };

  const handleUpdateStatus = async (firebaseId, newStatus) => {
    try {
      const jobRef = doc(db, "savedJobs", firebaseId);
      await updateDoc(jobRef, { status: newStatus });
    } catch (e) {
      console.error("Error updating status: ", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="py-12 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Apex <span className="text-blue-600">Career</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8">AI-Powered Job Hunting. Fast. Simple. Smart.</p>
        <SearchBar />
      </header>

      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setView("search")}
          className={`px-6 py-2 rounded-full font-medium transition ${view === "search" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 border"}`}
        >
          Search Jobs
        </button>
        <button
          onClick={() => setView("saved")}
          className={`px-6 py-2 rounded-full font-medium transition ${view === "saved" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 border"}`}
        >
          My Tracker ({savedJobs.length})
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4">
        {status === "loading" && view === "search" && (
          <p className="text-center text-gray-500 mb-8">Hunting for the best opportunities...</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(view === "search" ? list : savedJobs).map((job) => (
            <div
              key={job.id || job.job_id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={job.employer_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer_name)}&background=random`}
                      alt="logo"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer_name)}&background=f3f4f6&color=6366f1`; }}
                    />
                  </div>

                  {view === "search" ? (
                    <button
                      onClick={() => handleSaveJob(job)}
                      disabled={savedJobIds.includes(job.job_id)}
                      className={`p-2 transition-colors rounded-full ${savedJobIds.includes(job.job_id) ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 bg-gray-50"}`}
                    >
                      <Bookmark size={20} fill={savedJobIds.includes(job.job_id) ? "currentColor" : "none"} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <h3 className="font-bold text-lg text-gray-800 line-clamp-2 leading-snug h-14">
                  {job.job_title}
                </h3>
                <p className="text-blue-600 font-medium mb-4">{job.employer_name}</p>

                {/* 🟢 INTEGRATED STATUS SELECTOR (Only shows in Tracker) */}
                {view === "saved" && (
                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Application Status</label>
                    <select
                      value={job.status || "Applied"}
                      onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                      className={`w-full p-2 rounded-lg text-sm font-semibold border-none cursor-pointer ${
                        job.status === "Offer" ? "bg-green-100 text-green-700" : 
                        job.status === "Interviewing" ? "bg-yellow-100 text-yellow-700" : 
                        job.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <option value="Applied">📄 Applied</option>
                      <option value="Interviewing">🤝 Interviewing</option>
                      <option value="Offer">🎉 Offer</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {job.job_city || "Remote"}
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                    {job.job_employment_type?.replace("_", " ")}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenAnalysis(job.job_title, job.job_description)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                >
                  <Sparkles size={18} /> AI Strategy
                </button>
              </div>
            </div>
          ))}
        </div>

        {view === "saved" && savedJobs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No jobs saved yet. Start hunting!</p>
        )}
      </main>

      <AIAnalysis
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        data={analysis}
        loading={analysisStatus === "loading"}
      />
    </div>
  );
}

export default App;