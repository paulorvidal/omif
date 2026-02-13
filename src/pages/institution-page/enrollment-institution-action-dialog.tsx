import { useState, useEffect } from "react";
import {
    AppDialog,
    AppDialogContent,
    AppDialogFooter,
    AppDialogTitle,
} from "@/components/app-dialog";
import { AppButton } from "@/components/app-button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ArrowRight, Loader2, Mail, Phone, Hash, Type } from "lucide-react";

import type { EnrollmentInstitution } from "@/types/enrollment-institution-types";
import type { CreateInstitutionRequest } from "@/types/institution-types";

interface EnrollmentInstitutionActionDialogProps {
    open: boolean;
    onClose: () => void;
    enrollment: EnrollmentInstitution | null;
    actionType: "APPROVE" | "REFUSE" | null;
    onConfirm: (enrollmentId: string, confirmChange: boolean) => void;
    isProcessing: boolean;
}

const getFieldIcon = (key: string) => {
    if (key.includes("email")) return <Mail className="size-3.5" />;
    if (key.includes("phone")) return <Phone className="size-3.5" />;
    if (key.includes("inep")) return <Hash className="size-3.5" />;
    return <Type className="size-3.5" />;
};

function DataComparisonTable({
    current,
    proposed
}: {
    current: CreateInstitutionRequest,
    proposed: CreateInstitutionRequest
}) {
    const fields: { key: keyof CreateInstitutionRequest; label: string }[] = [
        { key: "name", label: "Nome" },
        { key: "inep", label: "INEP" },
        { key: "phoneNumber", label: "Telefone" },
        { key: "email1", label: "Email 1" },
        { key: "email2", label: "Email 2" },
        { key: "email3", label: "Email 3" },
    ];

    const changes = fields.filter(f => {
        const valProposed = proposed[f.key];
        const valCurrent = current[f.key];
        const safeProposed = valProposed || "";
        const safeCurrent = valCurrent || "";
        return safeProposed !== "" && safeProposed !== safeCurrent;
    });

    if (changes.length === 0) return null;

    return (
        <div className="rounded-md border border-amber-200 overflow-hidden text-sm shadow-sm bg-white">
            {/* Header da Tabela */}
            <div className="grid grid-cols-12 bg-amber-50 px-3 py-2 font-medium border-b border-amber-200 text-amber-900 items-center text-[10px] uppercase tracking-wider">
                <div className="col-span-3 font-bold">Campo</div>
                <div className="col-span-4 opacity-70">Valor Atual</div>
                <div className="col-span-1"></div>
                <div className="col-span-4 font-bold text-amber-700">Novo Valor</div>
            </div>

            {/* Corpo da Tabela */}
            <div className="divide-y divide-amber-100">
                {changes.map((field) => (
                    <div key={field.key} className="grid grid-cols-12 px-3 py-2 items-center hover:bg-amber-50/40 transition-colors min-h-[2.5rem]">
                        <div className="col-span-3 font-medium text-muted-foreground flex items-center gap-1.5 pr-1 overflow-hidden">
                            <span className="text-amber-600/70 shrink-0 bg-amber-100 p-0.5 rounded-sm">
                                {getFieldIcon(field.key)}
                            </span>
                            <span className="truncate text-xs" title={field.label}>{field.label}</span>
                        </div>

                        <div className="col-span-4 text-muted-foreground text-xs line-through decoration-red-300 decoration-2 pr-2">
                            <span className="truncate block w-full" title={current[field.key] || "Vazio"}>
                                {current[field.key] || <span className="italic opacity-50">Vazio</span>}
                            </span>
                        </div>

                        <div className="col-span-1 flex justify-center text-amber-400">
                            <ArrowRight className="size-3" />
                        </div>

                        <div className="col-span-4">
                            <span className="text-amber-700 font-semibold break-all bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block w-fit max-w-full text-xs">
                                {proposed[field.key] || <span className="italic opacity-50 font-normal">Remover</span>}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function EnrollmentInstitutionActionDialog({
    open,
    onClose,
    enrollment,
    actionType,
    onConfirm,
    isProcessing
}: EnrollmentInstitutionActionDialogProps) {
    const [shouldApplyChanges, setShouldApplyChanges] = useState(true);

    useEffect(() => {
        if (open && enrollment?.changedInstitutionData) {
            setShouldApplyChanges(true);
        }
    }, [open, enrollment]);

    if (!enrollment) return null;

    const isApprove = actionType === "APPROVE";
    const hasChanges = !!enrollment.changedInstitutionData;

    return (
        // MUDANÇA PRINCIPAL: A classe de largura vai AQUI no componente pai
        <AppDialog
            open={open}
            onOpenChange={(isOpen) => !isOpen && onClose()}
            className="sm:max-w-3xl"
        >
            <AppDialogTitle>
                {isApprove ? "Aprovar Inscrição" : "Recusar Inscrição"}
            </AppDialogTitle>

            {/* Removemos className daqui pois o componente não aceita */}
            <AppDialogContent>
                <div className="flex flex-col gap-4">
                    {/* Cabeçalho de Informações */}
                    <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground text-xs mb-0.5 uppercase tracking-wider font-bold">
                                        Instituição solicitante
                                    </p>
                                    <h3 className="font-bold text-lg text-foreground leading-tight">
                                        {enrollment.institution.name}
                                    </h3>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${isApprove ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {isApprove ? 'Aprovar' : 'Recusar'}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground font-medium">
                                <span className="flex items-center gap-1 bg-background px-1.5 py-0.5 rounded border shadow-sm">
                                    <Hash className="size-3" />
                                    {enrollment.institution.inep || "N/A"}
                                </span>
                                <span className="flex items-center gap-1 bg-background px-1.5 py-0.5 rounded border shadow-sm">
                                    <Mail className="size-3" />
                                    {enrollment.institution.email1}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Texto simples se não houver mudanças */}
                    {!hasChanges && isApprove && (
                        <p className="text-muted-foreground text-sm text-center">
                            Confirmar a aprovação habilitará esta instituição para a edição atual.
                        </p>
                    )}

                    {/* Área de Comparação (Se houver mudanças) */}
                    {hasChanges && isApprove && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-4 text-amber-600" />
                                <h4 className="font-bold text-foreground text-sm">Dados Cadastrais Divergentes</h4>
                            </div>

                            <DataComparisonTable
                                current={enrollment.institution}
                                proposed={enrollment.changedInstitutionData!}
                            />

                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">
                                <div
                                    className="flex items-start space-x-2.5 cursor-pointer select-none"
                                    onClick={() => setShouldApplyChanges(!shouldApplyChanges)}
                                >
                                    <Checkbox
                                        id="confirmChanges"
                                        checked={shouldApplyChanges}
                                        onCheckedChange={(checked) => setShouldApplyChanges(!!checked)}
                                        className="mt-0.5 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 border-amber-400 size-4"
                                    />
                                    <div className="grid gap-0.5">
                                        <Label
                                            htmlFor="confirmChanges"
                                            className="text-sm font-bold text-foreground cursor-pointer"
                                        >
                                            Atualizar cadastro principal
                                        </Label>
                                        <p className="text-[11px] text-muted-foreground leading-tight">
                                            Recomendado. Sobrescreve os dados antigos com os novos valores fornecidos na inscrição.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isApprove && (
                        <div className="flex gap-3 p-3 bg-red-50 text-red-900 text-sm rounded-md border border-red-100 items-start">
                            <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-bold text-xs uppercase">Ação Irreversível</p>
                                <p className="opacity-90 text-xs">
                                    Ao recusar, a vaga é liberada e a instituição é notificada por e-mail.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </AppDialogContent>

            {/* Removemos className daqui pois o componente não aceita */}
            <AppDialogFooter>
                <AppButton variant="secondary" onClick={onClose} type="button" disabled={isProcessing}>
                    Cancelar
                </AppButton>
                <AppButton
                    variant={isApprove ? "default" : "destructive"}
                    onClick={() => {
                        const confirm = isApprove ? shouldApplyChanges : false;
                        onConfirm(enrollment.id, confirm);
                    }}
                    disabled={isProcessing}
                    className={isApprove ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    icon={isProcessing ? <Loader2 className="animate-spin" /> : undefined}
                >
                    {isApprove ? "Confirmar" : "Recusar"}
                </AppButton>
            </AppDialogFooter>
        </AppDialog>
    );
}