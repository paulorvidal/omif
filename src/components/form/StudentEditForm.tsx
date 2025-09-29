import { useParams } from "react-router-dom";
import { useStudentEditForm } from "../../hooks/useStudentEditForm";
import { Field } from "../Field";
import { Button } from "../Button";
import { AsyncSelect } from "../AsyncSelect";

export const StudentEditForm = () => {
  const { id } = useParams<{ id?: string }>();
  const {
    control,
    errors,
    register,
    onSubmit,
    reset,
    isLoadingStudent,
    isUpdating,
    institutionOptions,
    isInstitutionsLoading,
    setInstitutionInput,
  } = useStudentEditForm(id);

  if (isLoadingStudent) {
    return <p className="text-center">Carregando dados do estudante...</p>;
  }

  return (
    <form
      className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8"
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Nome:"
          type="text"
          placeholder="Ex: Nome Completo"
          register={register("name")}
          error={errors.name?.message}
        />
        <Field
          label="Nome Social (Opcional):"
          type="text"
          placeholder="Ex: Nome"
          register={register("socialName")}
          error={errors.socialName?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="E-mail:"
          type="email"
          placeholder="Ex: nome@email.com"
          register={register("email")}
          error={errors.email?.message}
        />
        <Field
          label="CPF:"
          type="text"
          placeholder="Ex: 000.000.000-00"
          mask="999.999.999-99"
          register={register("cpf")}
          error={errors.cpf?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Data de Nascimento:"
          type="date"
          register={register("birthDate")}
          error={errors.birthDate?.message}
        />

        <AsyncSelect
          name="institution"
          label="Instituição:"
          placeholder="Digite para buscar..."
          control={control}
          options={institutionOptions}
          onInputChange={setInstitutionInput}
          isLoading={isInstitutionsLoading}
          error={errors.institution?.message}
        />
      </div>

      <div className="flex justify-between">
        <Button
          secondary
          type="button"
          onClick={() => reset()}
          disabled={isUpdating}
        >
          Desfazer
        </Button>
        <Button type="submit" isLoading={isUpdating}>
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};
