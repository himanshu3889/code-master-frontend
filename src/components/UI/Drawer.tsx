import {
  Drawer,
  List,
  Typography,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import { Problem } from '../../utils/types';
import { useNavigate, useParams } from 'react-router-dom';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { usethemeUtils } from '../../context/ThemeWrapper';

export default function CustomDrawer({
  open,
  problems,
  toggleDrawer,
}: {
  open: boolean;
  problems: Problem[];
  toggleDrawer: () => void;
}) {
  const navigate = useNavigate();
  const { id: currentId } = useParams();
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';

  return (
    <Drawer
      PaperProps={{
        sx: {
          width: '30%',
          backgroundColor: isDark ? '#0f172a' : '#f8fafc',
          scrollbarWidth: 'thin',
        },
      }}
      open={open}
      onClose={() => toggleDrawer()}
    >
      <Stack margin={2} flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Problems List
        </Typography>
        <IconButton size="small" onClick={() => toggleDrawer()}>
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Divider />
      <List>
        {problems.map((p) => {
          const isActive = p.id === currentId;
          return (
            <ListItem
              key={p.id}
              disablePadding
              sx={{
                backgroundColor: isActive
                  ? isDark
                    ? 'rgba(108, 92, 231, 0.12)'
                    : 'rgba(108, 92, 231, 0.08)'
                  : 'transparent',
                borderLeft: isActive ? '3px solid #6c5ce7' : '3px solid transparent',
              }}
            >
              <ListItemButton
                onClick={() => {
                  navigate(`/problem/${p.id}`);
                  toggleDrawer();
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 400 }}>
                      {p.name}
                    </Typography>
                  }
                />
                {p.group && (
                  <Typography variant="caption" sx={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                    {p.group}
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
