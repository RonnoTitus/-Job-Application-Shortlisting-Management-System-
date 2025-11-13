import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type ApplicationStatus = "pending" | "shortlisted" | "rejected" | "hired";

export interface Education {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  certifications: string[];
  status: ApplicationStatus;
  score?: number;
  notes?: string;
  appliedAt: string;
}

interface Filters {
  jobId?: string;
  status?: ApplicationStatus;
  searchTerm?: string;
}

interface ApplicationsState {
  applications: Application[];
  filteredApplications: Application[];
  filters: Filters;
  isLoading: boolean;
  error: string | null;
}

// ✅ Helpers to load/save localStorage
const loadApplications = (): Application[] => {
  try {
    const data = localStorage.getItem("applications");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveApplications = (apps: Application[]) => {
  try {
    localStorage.setItem("applications", JSON.stringify(apps));
  } catch (err) {
    console.error("Failed to save applications:", err);
  }
};

const initialState: ApplicationsState = {
  applications: loadApplications(),
  filteredApplications: [],
  filters: {},
  isLoading: false,
  error: null,
};

// ✅ Thunk: fetch all applications
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async () => loadApplications()
);

// ✅ Thunk: create new application
export const createApplication = createAsyncThunk(
  "applications/createApplication",
  async (application: Omit<Application, "id" | "appliedAt" | "status">) => {
    const existing = loadApplications();
    const newApp: Application = {
      ...application,
      id: Date.now().toString(),
      status: "pending",
      appliedAt: new Date().toISOString(),
    };

    const updated = [...existing, newApp];
    saveApplications(updated);
    return newApp;
  }
);

// ✅ Filter helper
const applyFilters = (applications: Application[], filters: Filters): Application[] => {
  return applications.filter((app) => {
    const matchJob = !filters.jobId || app.jobId === filters.jobId;
    const matchStatus = !filters.status || app.status === filters.status;
    const matchSearch =
      !filters.searchTerm ||
      app.applicantName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      app.skills.some((skill) =>
        skill.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      );
    return matchJob && matchStatus && matchSearch;
  });
};

// ✅ Slice
const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    updateApplicationStatus: (
      state,
      action: PayloadAction<{ id: string; status: ApplicationStatus; notes?: string }>
    ) => {
      const index = state.applications.findIndex((app) => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index].status = action.payload.status;
        if (action.payload.notes !== undefined) {
          state.applications[index].notes = action.payload.notes;
        }
        saveApplications(state.applications);
        state.filteredApplications = applyFilters(state.applications, state.filters);
      }
    },

    updateApplicationScore: (
      state,
      action: PayloadAction<{ id: string; score: number }>
    ) => {
      const index = state.applications.findIndex((app) => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index].score = action.payload.score;
        saveApplications(state.applications);
        state.filteredApplications = applyFilters(state.applications, state.filters);
      }
    },

    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
      state.filteredApplications = applyFilters(state.applications, state.filters);
    },

    clearFilters: (state) => {
      state.filters = {};
      state.filteredApplications = [...state.applications];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
        state.filteredApplications = applyFilters(action.payload, state.filters);
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        // 🔥 This ensures the new application shows up immediately
        state.applications.push(action.payload);
        saveApplications(state.applications);
        state.filteredApplications = applyFilters(state.applications, state.filters);
      });
  },
});

export const {
  updateApplicationStatus,
  updateApplicationScore,
  setFilters,
  clearFilters,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;
