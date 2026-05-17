import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Box, Chip, IconButton, Select, MenuItem, Typography, LinearProgress, TablePagination } from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';
import { Problem, ProblemStatus, problemStatusColors, problemStatusLabels, ProblemDifficultyLevel, problemDifficultyLabels, problemDifficultyColors } from '../../../utils/types';
import { formatRelativeTime } from '../../../utils/helpers';

interface ProblemsTableProps {
  problems: Problem[];
  isLoading: boolean;
  liveNewProblemIds: Set<string>;
  searchQuery: string;
  onStatusChange: (id: string, newStatus: string) => void;
  onDifficultyChange: (id: string, newDiff: string) => void;
}

export default function ProblemsTable({
  problems,
  isLoading,
  liveNewProblemIds,
  searchQuery,
  onStatusChange,
  onDifficultyChange,
}: ProblemsTableProps) {
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const navigate = useNavigate();

  const columnHelper = createColumnHelper<Problem>();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.status, {
        id: 'Status',
        header: () => <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Status</span>,
        cell: (info) => {
          const val = info.getValue() as ProblemStatus;
          const statusVal = val || ProblemStatus.TODO;
          return (
            <Select
              value={statusVal}
              onChange={(e) => {
                onStatusChange(info.row.original.id, e.target.value as string);
              }}
              onClick={(e) => e.stopPropagation()}
              IconComponent={() => null}
              renderValue={(selected) => {
                const c = problemStatusColors[selected as ProblemStatus] ?? theme.textSecondary;
                const l = problemStatusLabels[selected as ProblemStatus] ?? selected;
                return <Chip label={l} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: `${c}18`, color: c, border: `1px solid ${c}30`, cursor: 'pointer' }} />;
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { padding: 0, paddingRight: '0 !important', minHeight: 'auto' },
              }}
              MenuProps={{
                onClick: (e) => e.stopPropagation(),
              }}
            >
              {Object.values(ProblemStatus).map((status) => (
                <MenuItem key={status} value={status} sx={{ fontSize: '0.8rem' }}>
                  {problemStatusLabels[status as ProblemStatus]}
                </MenuItem>
              ))}
            </Select>
          );
        },
        size: 130,
      }),
      columnHelper.accessor((row) => row.name, {
        id: 'Name',
        header: () => <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Problem</span>,
        cell: (info) => {
          const problemId = info.row.original.id;
          const name = info.getValue() as string;
          const slug = `${problemId}-${name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
          const isNewLive = liveNewProblemIds.has(problemId);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Link
                to={`/problem/${slug}`}
                style={{
                  textDecoration: 'none',
                  color: theme.textPrimary,
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.textPrimary)}
              >
                {name}
              </Link>
              {isNewLive && (
                <Chip 
                  label="NEW" 
                  size="small" 
                  sx={{ 
                    height: 18, 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    bgcolor: theme.primaryBgActive, 
                    color: theme.primaryText, 
                    border: isDark ? `1px solid ${theme.primaryBorder}` : theme.primaryBorder,
                    borderRadius: '6px' 
                  }} 
                />
              )}
            </Box>
          );
        },
      }),
      columnHelper.accessor((row) => row.group, {
        id: 'Group',
        header: () => <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Group</span>,
        cell: (info) => (
          <Typography variant="body2" sx={{ color: theme.textSecondary, fontSize: '0.8rem' }}>
            {info.getValue() || '—'}
          </Typography>
        ),
        size: 200,
      }),
      columnHelper.accessor((row) => row.difficultyLevel, {
        id: 'Difficulty',
        header: () => <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Difficulty</span>,
        cell: (info) => {
          const val = info.getValue() as ProblemDifficultyLevel;
          const diffVal = val || '';
          return (
            <Select
              value={diffVal}
              displayEmpty
              onChange={(e) => {
                onDifficultyChange(info.row.original.id, e.target.value as string);
              }}
              onClick={(e) => e.stopPropagation()}
              IconComponent={() => null}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography variant="body2" sx={{ color: theme.textSecondary, fontSize: '0.8rem' }}>—</Typography>;
                }
                const c = problemDifficultyColors[selected as ProblemDifficultyLevel] ?? theme.textSecondary;
                const l = problemDifficultyLabels[selected as ProblemDifficultyLevel] ?? selected;
                return <Chip label={l} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: `${c}18`, color: c, border: `1px solid ${c}30`, cursor: 'pointer' }} />;
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { padding: 0, paddingRight: '0 !important', minHeight: 'auto' },
              }}
              MenuProps={{
                onClick: (e) => e.stopPropagation(),
              }}
            >
              <MenuItem value="" sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: theme.textSecondary }}>
                Unset
              </MenuItem>
              {Object.values(ProblemDifficultyLevel).map((diff) => (
                <MenuItem key={diff} value={diff} sx={{ fontSize: '0.8rem' }}>
                  {problemDifficultyLabels[diff as ProblemDifficultyLevel]}
                </MenuItem>
              ))}
            </Select>
          );
        },
        size: 130,
      }),
      columnHelper.accessor((row) => row.createdAt, {
        id: 'Created',
        header: () => <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>Added</span>,
        cell: (info) => (
          <Typography variant="caption" sx={{ color: theme.textTertiary }}>
            {info.getValue() ? formatRelativeTime(info.getValue()) : '—'}
          </Typography>
        ),
        size: 100,
      }),
      columnHelper.accessor((row) => row.url, {
        id: 'URL',
        header: () => null,
        cell: (info) =>
          info.getValue() ? (
            <IconButton
              size="small"
              component="a"
              href={info.getValue()}
              target="_blank"
              rel="noopener noreferrer"
              title="Open original problem"
              sx={{ color: theme.textTertiary, '&:hover': { color: theme.primary } }}
            >
              <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          ) : null,
        size: 50,
      }),
    ],
    [isDark, onStatusChange, onDifficultyChange, liveNewProblemIds, columnHelper]
  );

  const table = useReactTable({
    data: problems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  const { pageSize, pageIndex } = table.getState().pagination;

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 'var(--cm-radius)',
        border: `1px solid ${theme.borderSecondary}`,
        overflow: 'hidden',
        bgcolor: theme.bgPrimary,
      }}
    >
      {isLoading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': { bgcolor: theme.primary },
            zIndex: 10,
          }}
        />
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              style={{
                borderBottom: `1px solid ${theme.borderSecondary}`,
              }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: theme.textSecondary,
                    fontSize: '0.75rem',
                    backgroundColor: theme.bgTableHeader,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s', pointerEvents: isLoading ? 'none' : 'auto' }}>
          {table.getRowModel().rows.map((row, idx) => {
            const problemId = row.original.id;
            const name = row.original.name;
            const slug = `${problemId}-${name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
            const isNewLive = liveNewProblemIds.has(problemId);
            
            return (
              <tr
                key={row.id}
                className="problem-row"
                onClick={() => navigate(`/problem/${slug}`)}
                style={{
                  backgroundColor: isNewLive
                    ? theme.bgHover
                    : (idx % 2 === 0
                      ? 'transparent'
                      : theme.bgQuaternary),
                  cursor: 'pointer',
                  animationDelay: `${idx * 30}ms`,
                  borderLeft: isNewLive ? `4px solid ${theme.primary}` : '4px solid transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '14px 16px',
                      color: theme.textPrimary,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '48px 16px',
                  textAlign: 'center',
                  color: theme.textSecondary,
                }}
              >
                <Typography variant="body2">
                  {searchQuery ? 'No problems match your search' : 'No problems yet. Use Competitive Companion to add problems!'}
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        rowsPerPageOptions={[10, 15, 25, 50]}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        sx={{
          borderTop: `1px solid ${theme.borderSecondary}`,
          color: theme.textSecondary,
          '.MuiTablePagination-selectIcon': {
            color: theme.textSecondary,
          },
        }}
      />
    </Box>
  );
}
