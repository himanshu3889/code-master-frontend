import { Skeleton } from '@mui/material';

export default function SkeletonResultsLoader() {
  return (
    <>
      <div></div>
      <Skeleton variant='text' sx={{ marginTop: '10px' }}></Skeleton>
      <Skeleton variant='rounded' height={60} />
      <Skeleton variant='rounded' height={60} />
      <Skeleton variant='rounded' height={60} />
    </>
  );
}
