
import { useParams } from "react-router-dom";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useEnrollmentInstiturionForm } from "../../hooks/useEnrollmentInstiturionForm";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { redirectTo } from "../../utils/events";
import type { EnrollmentStatusResponse } from "../../types/institutionEnrollmentTypes";

export const EnrollmentInstitutionForm = () => {
    const { editionYear } = useParams<{ editionYear?: string }>();

    if (!editionYear) {
        return <div className="p-8 text-center">Carregando edição...</div>;
    }

    return <EnrollmentView editionYear={editionYear} />;
};

const EnrollmentView = ({ editionYear }: { editionYear: string }) => {
    const {
        errors,
        isSubmitting,
        register,
        handleFormSubmit,
        handleReset,
        enrollmentData,
        isLoadingStatus
    } = useEnrollmentInstiturionForm({ editionYear });

    if (isLoadingStatus) {
        return <div className="p-8 text-center">Verificando status da inscrição...</div>;
    }

    if (enrollmentData?.isEnrolled) {
        return <StatusDisplay enrollmentData={enrollmentData} />;
    }

    return (
        <>
            <form
                className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8"
                onSubmit={handleFormSubmit}
            >
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Inscrição - Edição {enrollmentData?.editionYear}
                    </h2>
                    <p className="text-gray-500">{enrollmentData?.editionName}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        label="Nome:"
                        type="text"
                        placeholder="Ex: NOME DA INSTITUIÇÃO"
                        register={register("name")}
                        error={errors.name?.message}
                        helpText="Informe o nome da instituição"
                    />
                    <Field
                        label="INEP:"
                        type="text"
                        placeholder="Ex: 00000000"
                        register={register("inep")}
                        error={errors.inep?.message}
                        helpText="Informe o INEP da instituição"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        label="E-mail:"
                        type="text"
                        placeholder="Ex: instituicao@email.com"
                        register={register("email1")}
                        error={errors.email1?.message}
                        helpText="Usaremos para comunicações importantes."
                    />
                    <Field
                        label="Telefone:"
                        type="text"
                        placeholder="Ex: (00)00000-0000"
                        mask={["(99)9999-9999", "(99)99999-9999"]}
                        register={register("phoneNumber")}
                        error={errors.phoneNumber?.message}
                        helpText="Formato (XX) XXXXX-XXXX"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        label="E-mail reserva:"
                        type="text"
                        placeholder="Ex: instituicao@email.com"
                        register={register("email2")}
                        error={errors.email2?.message}
                    />
                    <Field
                        label="E-mail reserva:"
                        type="text"
                        placeholder="Ex: instituicao@email.com"
                        register={register("email3")}
                        error={errors.email3?.message}
                    />
                </div>
                <div className="flex justify-between">
                    <Button secondary type="button" onClick={handleReset} disabled={isSubmitting}>
                        Desfazer Alterações
                    </Button>
                    <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                        Confirmar Inscrição
                    </Button>
                </div>
            </form>
        </>
    );
};


const StatusDisplay = ({ enrollmentData }: { enrollmentData: EnrollmentStatusResponse }) => {
    const statusConfig = {
        APPROVED: {
            icon: <CheckCircle className="h-10 w-10 text-white" />,
            title: "Inscrição Aprovada",
            description: "Parabéns! Sua instituição está confirmada para participar da edição.",
            iconBg: "bg-emerald-500",
            textColor: "text-emerald-800",
        },
        REFUSED: {
            icon: <XCircle className="h-10 w-10 text-white" />,
            title: "Inscrição Recusada",
            description: "Houve um problema com sua inscrição. Por favor, entre em contato com o suporte para mais detalhes.",
            iconBg: "bg-red-500",
            textColor: "text-red-800",
        },
        PENDING: {
            icon: <Clock className="h-10 w-10 text-white" />,
            title: "Inscrição Pendente",
            description: "Sua inscrição foi recebida com sucesso e está aguardando a análise pela nossa equipe.",
            iconBg: "bg-amber-500",
            textColor: "text-amber-800",
        },
    };

    const currentStatus = statusConfig[enrollmentData.status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="p-8 text-center">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${currentStatus.iconBg}`}>
                    {currentStatus.icon}
                </div>
                <h1 className={`mt-6 text-3xl font-bold ${currentStatus.textColor}`}>
                    {currentStatus.title}
                </h1>
                <p className="mt-2 text-base text-gray-600">
                    {currentStatus.description}
                </p>
                <div className="mt-8 rounded-md bg-slate-50 p-4">
                    <p className="text-sm font-medium text-gray-500">Edição</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {enrollmentData.editionYear} - {enrollmentData.editionName}
                    </p>
                </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <Button onClick={() => redirectTo('/avisos')} className="w-full">
                    Voltar para o Painel
                </Button>
            </div>
        </div>
    );
};
