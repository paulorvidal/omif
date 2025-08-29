import { useParams } from "react-router-dom";
import { useEnrollmentInstiturionForm } from "../../hooks/useEnrollmentInstiturionForm";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { ProgressDialog } from "../dialog/ProgressDialog";

export const EnrollmentInstitutionForm = () => {
    const { editionYear } = useParams<{ editionYear?: string }>();

    if (!editionYear) {
        return <div className="p-8 text-center">Carregando edição...</div>;
    }

    return <EnrollmentForm editionYear={editionYear} />;
};


const EnrollmentForm = ({ editionYear }: { editionYear: string }) => {
    const {
        errors,
        isSubmitting,
        register,
        handleFormSubmit,
        handleReset,
        enrollmentData,
        isLoadingStatus
    } = useEnrollmentInstiturionForm({ editionYear });

    return (
        <>
            <form
                className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8"
                onSubmit={handleFormSubmit}
            >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Inscrição - Edição {enrollmentData?.editionYear}
                        </h2>
                        <p className="text-gray-500">{enrollmentData?.editionName}</p>
                    </div>

                    {enrollmentData?.isEnrolled ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            Inscrita
                        </span>
                    ) : (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                            Pendente
                        </span>
                    )}
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
                    <Button
                        secondary
                        type="button"
                        onClick={handleReset}
                        disabled={isSubmitting}
                    >
                        Desfazer Alterações
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Confirmar Inscrição
                    </Button>
                </div>
            </form>
            <ProgressDialog open={isLoadingStatus} />
        </>
    );
};