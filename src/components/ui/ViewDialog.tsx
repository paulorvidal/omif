import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '../ui/Button';

export interface ViewDialogProps {
  open: boolean;
  title?: string;
  htmlContent: string; 
  onClose: () => void;
}

export function ViewDialog(props: ViewDialogProps) {
  const { open, title, htmlContent, onClose } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: '90vw',
            height: '90vh',
            maxWidth: 'none',
          },
        },
      }}
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent dividers>
        <Box 
           sx={{
            overflowWrap: 'break-word',
            wordWrap: 'break-word', 
            '& img, & video': {
              maxWidth: '100%',
              height: 'auto',
            },
            '& table, & pre': {
                maxWidth: '100%',
                overflowX: 'auto',
            }
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}