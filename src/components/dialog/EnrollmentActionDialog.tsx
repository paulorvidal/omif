import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { CreateInstitutionRequest } from "../../types/institutionTypes";

const ComparisonRow = ({ label, originalValue, newValue }: { label: string; originalValue?: string | null; newValue?: string | null }) => {
  const isChanged = originalValue !== newValue;
  const displayOriginal = originalValue || <span className="text-zinc-400 italic">N/A</span>;
  const displayNew = newValue || <span className="text-zinc-400 italic">N/A</span>;

  return (
    <div className={`p-2 rounded-md ${isChanged ? 'bg-yellow-50' : 'bg-zinc-50'}`}>
      <p className="text-xs font-semibold text-zinc-600">{label}</p>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="text-sm">
          <p className="text-zinc-400 text-xs">Valor Original</p>
          <p className="text-zinc-500">{displayOriginal}</p>
        </div>
        <div className={`text-sm ${isChanged ? 'font-bold text-yellow-900' : 'text-zinc-900'}`}>
          <p className={`${isChanged ? 'text-yellow-700' : 'text-zinc-400'} text-xs`}>Novo Valor</p>
          <p>{displayNew}</p>
        </div>
      </div>
    </div>
  );
};

export interface EnrollmentActionDialogProps {
  open: boolean;
  action: 'approve' | 'refuse' | null;
  originalData?: CreateInstitutionRequest | null;
  changedData?: CreateInstitutionRequest | null;
  onClose: () => void;
  onConfirm: () => void;
  onConfirmWithoutChanges?: () => void;
  isPending: boolean;
}

export function EnrollmentActionDialog({
  open,
  action,
  originalData,
  changedData,
  onClose,
  onConfirm,
  onConfirmWithoutChanges,
  isPending
}: EnrollmentActionDialogProps) {
  if (!action || !originalData || !changedData) return null;

  const isApproving = action === 'approve';
  const title = isApproving ? "Aprovar Inscrição" : "Recusar Inscrição";
  const description = "A instituição solicitou alterações nos dados. Revise-as e escolha a ação desejada.";
  const Icon = isApproving ? CheckCircle2 : AlertTriangle;
  const iconColor = isApproving ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";

  const fieldsToCompare: { key: keyof CreateInstitutionRequest; label: string }[] = [
    { key: "name", label: "Nome da Instituição" }, { key: "inep", label: "Código INEP" },
    { key: "phoneNumber", label: "Telefone" }, { key: "email1", label: "E-mail Principal" },
    { key: "email2", label: "E-mail Secundário" }, { key: "email3", label: "E-mail Adicional" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent className="p-4 sm:p-6">
        <div className="flex w-full justify-end">
          <IconButton aria-label="close" onClick={onClose} className="text-zinc-400 transition-colors hover:text-zinc-600">
            <X size={24} />
          </IconButton>
        </div>
        <div className="flex flex-col items-center px-4 pb-2 text-center">
          <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${iconColor}`}>
            <Icon className="h-8 w-8" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
          <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>
        </div>
        <div className="px-4 space-y-2">
          {fieldsToCompare.map(({ key, label }) => (
            <ComparisonRow key={key} label={label} originalValue={originalData[key]} newValue={changedData[key]} />
          ))}
        </div>
      </DialogContent>

      <DialogActions className="p-4 flex-wrap justify-center sm:justify-between">
        <div className="w-full sm:w-auto">
          <Button onClick={onClose} outline disabled={isPending} >
            Cancelar
          </Button>
        </div>
        <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
          {isApproving ? (
            <>
              <Button onClick={onConfirmWithoutChanges} outline isLoading={isPending} >
                Aprovar sem Alterações
              </Button>
              <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" isLoading={isPending}>
                Aprovar com Alterações
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onConfirmWithoutChanges} destructive outline isLoading={isPending} >
                Recusar sem Alterações
              </Button>
              <Button onClick={onConfirm} destructive isLoading={isPending} className="w-full sm:w-auto">
                Recusar com Alterações
              </Button>
            </>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}