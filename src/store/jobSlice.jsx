import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//data from server localhost: PORT
export const searchJobs = createAsyncThunk(
  'jobs/searchJobs',
  async ({ role, location }) => {
    const response = await axios.get('https://apex-career-server.onrender.com/api/search-jobs', {
      params: { role, location }
    });
    return response.data; // job array
  }
);

export const analyzeJob = createAsyncThunk(
  'jobs/analyzeJob',
  async ({ title, description }) => {
    const response = await axios.post('https://apex-career-server.onrender.com/api/analyze-job', { title, description });
    return response.data.analysis;
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    analysis: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    analysisStatus: 'idle',
    error: null
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(searchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // Store the jobs in our "list"
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(analyzeJob.pending, (state) => {
      state.analysisStatus = 'loading';
      state.analysis = null; // Clear old analysis
      })
      .addCase(analyzeJob.fulfilled, (state, action) => {
      state.analysisStatus = 'succeeded';
      state.analysis = action.payload; // Store the text from Gemini
      });
  }
});

export default jobSlice.reducer;