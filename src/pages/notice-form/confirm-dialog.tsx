import { AppButton } from "@/components/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog"; 
import { Check, X } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmDialog({ open, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <AppDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AppDialogTitle>Publicar aviso</AppDialogTitle>

      <AppDialogContent>
        Tem certeza que deseja publicar o aviso? Esta ação não pode ser
        desfeita.
      </AppDialogContent>

      <AppDialogFooter>
        <AppButton
          variant="secondary"
          type="button"
          onClick={onCancel}
          icon={<X />}
        >
          Cancelar
        </AppButton>
        <AppButton type="button" onClick={onConfirm} icon={<Check />} autoFocus>
          Confirmar
        </AppButton>
      </AppDialogFooter>
    </AppDialog>
  );
}

export { ConfirmDialog };
