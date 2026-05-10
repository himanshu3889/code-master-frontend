import ProblemsSet from '../Problems';
import HomeNavbar from './HomeNavbar';
import { useQuery } from '@tanstack/react-query';
import { getProblems } from '../../../services/codeMasterApi';
import { useProblemSlice } from '../../../store/problemSlice/problem';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { usethemeUtils } from '../../../context/ThemeWrapper';
// import Footer from '../../UI/Footer';

function Home() {
  const setProblems = useProblemSlice((state) => state.setProblems);
  const { colorMode } = usethemeUtils();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['problems'],
    queryFn: () => getProblems(50),
  });

  useEffect(() => {
    if (data) {
      setProblems(data);
    }
  }, [data, setProblems]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          colorMode === 'dark'
            ? 'var(--cm-gradient-surface)'
            : '#f8fafc',
      }}
    >
      <HomeNavbar />

      {/* Hero Section */}
      {/* <Box
        className="hero-gradient animate-fade-in-up"
        sx={{
          py: { xs: 4, md: 6 },
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.03em',
            mb: 1.5,
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            color: colorMode === 'dark' ? '#e2e8f0' : '#1e293b',
          }}
        >
          Master Your{' '}
          <Box component="span" className="gradient-text">
            Competitive Programming
          </Box>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colorMode === 'dark' ? '#94a3b8' : '#64748b',
            maxWidth: 600,
            mx: 'auto',
            fontSize: '1.05rem',
            lineHeight: 1.6,
          }}
        >
          Track problems from Competitive Companion, view submissions, and
          replay your coding journey — all in one place.
        </Typography>
      </Box> */}

      {/* Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 12,
            }}
          >
            <CircularProgress
              sx={{ color: 'var(--cm-primary)' }}
              size={40}
            />
          </Box>
        ) : isError ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 12,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: 'var(--cm-error)', mb: 1 }}
            >
              Failed to load problems
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'var(--cm-text-secondary)' }}
            >
              {error instanceof Error
                ? error.message
                : 'Connection error. Make sure the backend is running.'}
            </Typography>
          </Box>
        ) : (
          <ProblemsSet problems={data ?? []} />
        )}
      </Box>

      {/* <Footer /> */}
    </Box>
  );
}

export default Home;
