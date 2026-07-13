// Ambient type declarations — globally available, no import needed.
// All interfaces in this file reference only other types, never runtime enums.

interface TestCase {
  input: string;
  output: string;
}

interface IWebsocketMessage {
  event: string;
  room: string;
  data: any;
}

type ExecutionStatus = 'AC' | 'CE' | 'RE' | 'WA' | 'TLE' | 'MLE';

interface TestResult {
  testIndex: number;
  passed: boolean;
  status: ExecutionStatus;
  timeMs: number;
  memoryBytes: number;
  stderr?: string;
  stdout?: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
  template?: string;
  createdAt: string;
}

interface CodeSnapshot {
  id: string;
  problemId: string;
  interviewSessionId?: string | null;
  language: string;
  code: string;
  createdAt: string;
}

interface Submission {
  id: string;
  problemId: string;
  interviewSessionId: string | null;
  language: string;
  status: ExecutionStatus | null;
  executionTimeMs?: number;
  memoryUsedKb?: number;
  stdin: string;
  stdout?: string;
  stderr?: string;
  testCases: string[];
  testResults: TestResult[];
  createdAt: string;
}

interface Timeline {
  id: string;
  problemId: string;
  submissionId?: string;
  codeSnapshotId?: string;
  createdAt: string;
}

interface DetailedTimeline {
  timelineId: number;
  timelineCreatedAt: string;
  codeSnapshotId?: number;
  code?: string;
  snapshotLanguage?: string;
  snapshotCreatedAt?: string;
  submissionId?: number;
  submissionStatus?: string;
  executionTimeMs?: number;
  memoryUsedKb?: number;
  stdin?: string;
  stdout?: string;
  stderr?: string;
  testCases?: TestCase[];
  testResults?: TestResult[];
  submissionCreatedAt?: string;
}

interface PaginatedResponse<T> {
  data: T;
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page?: number;
  prev_page?: number;
  has_next: boolean;
  has_prev: boolean;
}

interface themeContext {
  toggleColorMode: () => void;
  colorMode: 'light' | 'dark';
}

interface contextWrapperProps {
  children: React.ReactNode;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  wrapperClassName?: string;
  innerDivClassName?: string;
}

// Interview Session
type InterviewSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'TIMEOUT' | 'ABANDONED';

interface InterviewSession {
  id: string;
  problemId: string;
  status: InterviewSessionStatus;
  timeLimitSeconds: number;
  remainingSeconds?: number;
  startedAt: string;
  endedAt?: string;
  autoSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
}
