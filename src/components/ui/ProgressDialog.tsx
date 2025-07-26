import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface ProgressDialogProps {
  open: boolean;
}

export function ProgressDialog({ open }: ProgressDialogProps) {
  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress className="!text-green-600" size={60} />
    </Backdrop>
  );
}