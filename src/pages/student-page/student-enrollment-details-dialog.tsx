import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { AppBadge } from "@/components/app-badge";
import { AppButton } from "@/components/app-button";
import type { EnrollmentStudent } from "@/types/enrollment-student-types";
import { formatDate } from "@/utils/format-date";

const statusLabels: Record<EnrollmentStudent["status"], string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REFUSED: "Recusada",
};

const statusBadgeMap: Record<EnrollmentStudent["status"], "success" | "error" | "warning"> = {
  PENDING: "warning",
  APPROVED: "success",
  REFUSED: "error",
};

type StudentEnrollmentDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: EnrollmentStudent | null;
};

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">
        {value || "Não informado"}
      </span>
    </div>
  );
}

function StudentEnrollmentDetailsDialog({
  open,
  onOpenChange,
  enrollment,
}: StudentEnrollmentDetailsDialogProps) {
  const studentName = enrollment?.student?.name || "";
  const socialName = enrollment?.student?.socialName || "";
  const email = enrollment?.student?.email || "";
  const cpf = enrollment?.student?.cpf || "";
  const institution = enrollment?.institution?.name || "";

  const formattedEnrollmentDate = useMemo(() => {
    if (!enrollment?.enrollmentDate) return "";
    return formatDate(enrollment.enrollmentDate);
  }, [enrollment?.enrollmentDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Detalhes da inscrição</DialogTitle>
        </DialogHeader>

        {enrollment ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed border-muted-foreground/40 px-4 py-3">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {socialName || studentName || "Estudante sem nome"}
                </p>
                {socialName ? (
                  <p className="text-sm text-muted-foreground">{studentName}</p>
                ) : null}
              </div>
              <AppBadge type={statusBadgeMap[enrollment.status]}>
                {statusLabels[enrollment.status]}
              </AppBadge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="CPF" value={cpf} />
              <DetailItem label="E-mail" value={email} />
              <DetailItem label="Instituição" value={institution} />
              <DetailItem label="Data de inscrição" value={formattedEnrollmentDate} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Gênero" value={enrollment.gender} />
              <DetailItem label="Bolsa Família" value={enrollment.bolsaFamilia} />
              <DetailItem label="Série" value={String(enrollment.grade)} />
              <DetailItem label="Raça/Cor" value={enrollment.ethnicity} />
              <DetailItem
                label="Conclusão do Ensino Fundamental"
                value={enrollment.completionElementarySchoolCategory}
              />
              <DetailItem label="Faixa de renda" value={enrollment.incomeRange} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma inscrição selecionada.
          </p>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <AppButton type="button" variant="secondary">
              Fechar
            </AppButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { StudentEnrollmentDetailsDialog };
