import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  qualifications: string[];
  responsibilities: string[];
  deadline: string;
  status: "draft" | "published" | "closed";
  createdAt: string;
  updatedAt: string;
}

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
};

// ✅ Safe LocalStorage Utilities
const isBrowser = typeof window !== "undefined";

const loadJobsFromStorage = (): Job[] => {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem("jobs");
    if (!data || data === "undefined") return [];
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading jobs from localStorage:", err);
    localStorage.removeItem("jobs");
    return [];
  }
};

const saveJobsToStorage = (jobs: Job[]) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  } catch (err) {
    console.error("Failed to save jobs to localStorage:", err);
  }
};

// ✅ Thunks
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  return loadJobsFromStorage();
});

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
    const existingJobs = loadJobsFromStorage();
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedJobs = [...existingJobs, newJob];
    saveJobsToStorage(updatedJobs);
    return newJob;
  }
);

// ✅ NEW: Fetch single job by ID
export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id: string) => {
    const jobs = loadJobsFromStorage();
    const job = jobs.find((j) => j.id === id);
    if (!job) throw new Error("Job not found");
    return job;
  }
);

// ✅ Slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    // ✅ Add inside createSlice reducers:
deleteJob: (state, action) => {
  state.jobs = state.jobs.filter(job => job.id !== action.payload);
},

    setCurrentJob(state, action: PayloadAction<Job | null>) {
      state.currentJob = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch all jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch jobs";
      })

      // Create new job
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.jobs.push(action.payload);
        saveJobsToStorage(state.jobs);
      })

      // ✅ Handle fetch single job
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.isLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch job";
      });
  },
});
//export const { addJob, updateJob, deleteJob } = jobsSlice.actions;
export const { setCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer;
