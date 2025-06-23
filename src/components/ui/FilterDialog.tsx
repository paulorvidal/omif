import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import { Button } from '../ui/Button';
import { Field } from '../form/Field';
import { useForm, Controller } from 'react-hook-form';

export interface TableFilters {
  pageSize: number;
}

interface FilterDialogProps {
  open: boolean;
  initialFilters: TableFilters;
  onClose: () => void;
  onApply: (filters: TableFilters) => void;
  title?: string;
}

export function FilterDialog(props: FilterDialogProps) {
  const { open, initialFilters, onClose, onApply, title } = props;
  const MIN = 1;
  const MAX = 50;

  const { control, handleSubmit, reset } = useForm<TableFilters>({
    defaultValues: initialFilters,
  });

  React.useEffect(() => {
    reset(initialFilters);
  }, [initialFilters, reset]);

  const onSubmit = (data: TableFilters) => {
    onApply(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title ?? 'Filtros'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ajuste os filtros e clique em “Aplicar”.
        </DialogContentText>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <Controller
            name="pageSize"
            control={control}
            rules={{
              required: 'Quantidade obrigatória',
              min: { value: MIN, message: `Mínimo ${MIN}` },
              max: { value: MAX, message: `Máximo ${MAX}` },
            }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <Field
                  label="Itens por página"
                  type="number"
                  placeholder="Número de itens"
                  error={fieldState.error?.message}
                  register={field}
                  inputProps={{ min: MIN, max: MAX }}
                />
              </FormControl>
            )}
          />
          <DialogActions>
            <Button onClick={onClose} secondary>
              Cancelar
            </Button>
            <Button type="submit">
              Aplicar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}