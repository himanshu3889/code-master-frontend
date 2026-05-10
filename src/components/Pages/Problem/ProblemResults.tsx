import { Stack, Typography } from '@mui/material';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';

export default function ProblemResults({
  variables,
  inputValues,
  standardOutput,
  expectedOutput,
}: {
  variables: string[];
  inputValues: string[];
  standardOutput: string | null;
  expectedOutput: string | null;
}) {
  const { colorMode } = usethemeUtils();
  const theme = getThemeColors(colorMode as 'dark' | 'light');

  return (
    <Stack>
      {variables.map((l, j) => (
        <Stack key={`input${j}`}>
          <Typography className='tw-p-2' color='primary'>
            {l} =
          </Typography>
          <Typography variant='body1' className='tw-p-2' sx={{ backgroundColor: theme.bgTableHeader, borderRadius: '6px', color: theme.textPrimary }}>
            {inputValues[j]}
          </Typography>
        </Stack>
      ))}
      <Typography className='tw-p-2' color='primary'>
        Output
      </Typography>
      <Typography sx={{ backgroundColor: theme.bgTableHeader, borderRadius: '6px', color: theme.textPrimary }} className='tw-p-2'>
        {standardOutput}
      </Typography>
      <Typography className='tw-p-2' color='primary'>
        Expected
      </Typography>
      <Typography sx={{ backgroundColor: theme.bgTableHeader, borderRadius: '6px', color: theme.textPrimary }} className='tw-p-2'>
        {expectedOutput}
      </Typography>
    </Stack>
  );
}
