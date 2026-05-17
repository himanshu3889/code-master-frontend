import api from '../API/Index';
import {
  Problem,
  Language,
  CodeSnapshot,
  Submission,
  Timeline,
  DetailedTimeline,
} from '../utils/types';

// ==================== Problems ====================

export const getProblems = async (limit = 50, status?: string): Promise<Problem[]> => {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (status) params.append('status', status);
  const response = await api.get<Problem[]>(`/api/problems?${params.toString()}`);
  return response.data;
};

export const getProblemsAfter = async (afterId: string, limit = 50): Promise<Problem[]> => {
  const response = await api.get<Problem[]>(
    `/api/problems/after/${afterId}?limit=${limit}`
  );
  return response.data;
};

export const getProblemsBefore = async (beforeId: string, limit = 50): Promise<Problem[]> => {
  const response = await api.get<Problem[]>(
    `/api/problems/before/${beforeId}?limit=${limit}`
  );
  return response.data;
};

export const getLatestProblem = async (): Promise<Problem> => {
  const response = await api.get<Problem>('/api/problems/current');
  return response.data;
};

export const getProblem = async (id: string): Promise<Problem> => {
  const response = await api.get<Problem>(`/api/problems/${id}`);
  return response.data;
};

export const createProblem = async (data: Partial<Problem>): Promise<Problem> => {
  const response = await api.post<Problem>('/', data);
  return response.data;
};

export const updateProblemNotes = async (id: string, notes: string): Promise<Problem> => {
  const response = await api.patch<Problem>(`/api/problems/${id}/notes`, { notes });
  return response.data;
};

export const updateProblemDescription = async (id: string, description: string): Promise<Problem> => {
  const response = await api.patch<Problem>(`/api/problems/${id}/description`, { description });
  return response.data;
};

export const updateProblemDifficulty = async (id: string, difficulty_level: string): Promise<Problem> => {
  const response = await api.patch<Problem>(`/api/problems/${id}/difficulty`, { difficulty_level });
  return response.data;
};

export const updateProblemStatus = async (id: string, status: string): Promise<Problem> => {
  const response = await api.patch<Problem>(`/api/problems/${id}/status`, { status });
  return response.data;
};

export const getProblemWithSubmissions = async (
  id: string
): Promise<{ problem: Problem; submissions: Submission[] }> => {
  const response = await api.get<{ problem: Problem; submissions: Submission[] }>(
    `/api/problems/${id}/submissions`
  );
  return response.data;
};

export const searchProblemsFuzzy = async (q: string, status?: string, limit = 20): Promise<Problem[]> => {
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (status) params.append('status', status);
  params.append('limit', limit.toString());
  const response = await api.get<{ results: Problem[] }>(`/api/problems/search?${params.toString()}`);
  return response.data.results || [];
};

// ==================== Languages ====================

export const getLanguages = async (): Promise<Language[]> => {
  const response = await api.get<Language[]>('/api/languages');
  return response.data;
};

export const getLanguageByCode = async (code: string): Promise<Language> => {
  const response = await api.get<Language>(`/api/languages/${code}`);
  return response.data;
};

export const createLanguage = async (data: { name: string; code: string }): Promise<Language> => {
  const response = await api.post<Language>('/api/languages', data);
  return response.data;
};

// ==================== Code Snapshots ====================

export const createSnapshot = async (data: {
  problemId: string;
  language: string;
  code: string;
}): Promise<CodeSnapshot> => {
  const response = await api.post<CodeSnapshot>('/api/snapshots', data);
  return response.data;
};

export const getSnapshotsByProblem = async (
  problemId: string,
  limit = 20
): Promise<CodeSnapshot[]> => {
  const response = await api.get<CodeSnapshot[]>(
    `/api/problems/${problemId}/snapshots?limit=${limit}`
  );
  return response.data;
};

export const getSnapshotById = async (id: string): Promise<CodeSnapshot> => {
  const response = await api.get<CodeSnapshot>(`/api/snapshots/${id}`);
  return response.data;
};

export const submitCodeExecution = async (payload: {
  problemId: string;
  language: string;
  sourceCode: string;
}): Promise<any> => {
  const response = await api.post('/api/execution', payload);
  return response.data;
};

export const createSubmission = async (
  problemId: string,
  submission: Partial<Submission>
): Promise<Submission> => {
  const response = await api.post<Submission>(`/api/problems/${problemId}/submissions`, submission);
  return response.data;
};

// ==================== Timeline ====================

export const createTimelineEntry = async (data: {
  problemId: string;
  submissionId?: string;
  codeSnapshotId?: string;
}): Promise<Timeline> => {
  const response = await api.post<Timeline>('/api/timeline', data);
  return response.data;
};

export const getTimeline = async (problemId: string, limit = 50): Promise<Timeline[]> => {
  const response = await api.get<Timeline[]>(
    `/api/problems/${problemId}/timeline?limit=${limit}`
  );
  return response.data;
};

export const getDetailedTimeline = async (
  problemId: string,
  limit = 50
): Promise<DetailedTimeline[]> => {
  const response = await api.get<DetailedTimeline[]>(
    `/api/problems/${problemId}/story?limit=${limit}`
  );
  return response.data;
};
