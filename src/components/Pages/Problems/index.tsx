import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { searchProblemsFuzzy, getProblems, updateProblemStatus, updateProblemDifficulty } from '../../../services/codeMasterApi';
import { Problem } from '../../../utils/types';
import { Box } from '@mui/material';
import CreateProblemModal from './CreateProblemModal';
import { toast } from 'sonner';
import { useSocket } from '../../../context/SocketContext';
import ProblemsToolbar from './ProblemsToolbar';
import ProblemsTable from './ProblemsTable';

export default function ProblemsSet({ problems }: { problems: Problem[] }) {
  const { lastMessage } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [activeProblems, setActiveProblems] = useState<Problem[]>(problems);
  const [liveNewProblemIds, setLiveNewProblemIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (lastMessage?.event === 'problem.new') {
      const newProblem = lastMessage.data as Problem;

      setActiveProblems((prev) => {
        const existingIdx = prev.findIndex(p => p.id === newProblem.id);
        if (existingIdx !== -1) {
          const next = [...prev];
          next[existingIdx] = { ...next[existingIdx], ...newProblem };
          return next;
        }
        return [newProblem, ...prev];
      });

      setLiveNewProblemIds((prev) => {
        const next = new Set(prev);
        next.add(newProblem.id);
        return next;
      });

      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (!searchQuery && !searchStatus) {
      setActiveProblems(problems);
      setIsLoading(false);
      setLiveNewProblemIds(new Set());
    }
  }, [problems, searchQuery, searchStatus]);

  const handleProblemCreated = (newProblem: Problem) => {
    setActiveProblems((prev) => [newProblem, ...prev]);
  };

  const handleReset = async () => {
    setSearchQuery('');
    setSearchStatus('');
    setLiveNewProblemIds(new Set());
    setIsLoading(true);
    try {
      const res = await getProblems(50);
      setActiveProblems(res);
    } catch (err) {
      console.error('Failed to fetch problems on reset:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (q: string, s: string) => {
      try {
        if (!q && !s) {
          setIsLoading(false);
          return;
        }

        setLiveNewProblemIds(new Set());

        if (!q && s) {
          const res = await getProblems(50, s);
          setActiveProblems(res);
        } else {
          const res = await searchProblemsFuzzy(q, s || undefined, 50);
          setActiveProblems(res);
        }
      } catch (err) {
        console.error('Failed to search problems:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400),
    []
  );

  const handleClearSearch = () => {
    setSearchQuery('');
    setLiveNewProblemIds(new Set());
    setIsLoading(true);
    debouncedSearch('', searchStatus);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setIsLoading(true);
    debouncedSearch(val, searchStatus);
  };

  const handleSearchStatusChange = (val: string) => {
    setSearchStatus(val);
    setIsLoading(true);
    debouncedSearch(searchQuery, val);
  };

  const handleStatusChange = useCallback(async (id: string, newStatus: string) => {
    setActiveProblems((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    try {
      await updateProblemStatus(id, newStatus);
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  }, []);

  const handleDifficultyChange = useCallback(async (id: string, newDiff: string) => {
    setActiveProblems((prev) => prev.map((p) => (p.id === id ? { ...p, difficultyLevel: newDiff } : p)));
    try {
      await updateProblemDifficulty(id, newDiff);
      toast.success('Difficulty updated');
    } catch (err) {
      toast.error('Failed to update difficulty');
    }
  }, []);

  return (
    <Box className="animate-fade-in-up">
      <ProblemsToolbar
        searchQuery={searchQuery}
        searchStatus={searchStatus}
        onSearchChange={handleSearchChange}
        onStatusChange={handleSearchStatusChange}
        onClearSearch={handleClearSearch}
        onReset={handleReset}
        onCreateClick={() => setCreateModalOpen(true)}
        activeCount={activeProblems ? activeProblems.length : 0}
      />

      <ProblemsTable
        problems={activeProblems}
        isLoading={isLoading}
        liveNewProblemIds={liveNewProblemIds}
        searchQuery={searchQuery}
        onStatusChange={handleStatusChange}
        onDifficultyChange={handleDifficultyChange}
      />

      <CreateProblemModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleProblemCreated}
      />
    </Box>
  );
}
