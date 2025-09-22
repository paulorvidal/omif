import { useMemo } from "react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { SelectField } from "../ui/SelectField";
import { AsyncSelect } from "../ui/AsyncSelect";
import { useEnrollmentStudentForm } from "../../hooks/useEnrollmentStudentForm";
import Captcha from "../ui/Captcha";

interface Props {
  editionName: string;
  minimumWage: number;
  editionYear: number;
}

export const EnrollmentStudentForm = ({ minimumWage, editionName, editionYear }: Props) => {
  const {
    register,
    control,
    errors,
    handleSubmit,
    handleReset,
    isPending,
    setCaptchaToken,
    captchaResetKey,
    captchaError,
    institutionOptions,
    isInstitutionsLoading,
    setInstitutionInput,
  } = useEnrollmentStudentForm(editionYear);

  const bolsaFamiliaOptions = [
    { label: "Selecione uma opção", value: "" },
    { label: "Sim", value: "Sim" },
    { label: "Não", value: "Não" },
    { label: "Prefiro não responder", value: "Prefiro não responder" },
  ];

  const gradeOptions = [
    { label: "Selecione a série", value: "" },
    { label: "1º ano", value: 1 },
    { label: "2º ano", value: 2 },
    { label: "3º ano", value: 3 },
  ];

  const ethnicityOptions = [
    { label: "Selecione uma opção", value: "" },
    { label: "Amarelo", value: "Amarelo" },
    { label: "Branco", value: "Branco" },
    { label: "Indígena", value: "Indigena" },
    { label: "Pardo", value: "Pardo" },
    { label: "Preto", value: "Preto" },
    { label: "Prefiro não responder", value: "Prefiro não responder" },
  ];

  const genderOptions = [
    { label: "Selecione uma opção", value: "" },
    { label: "Feminino", value: "Feminino" },
    { label: "Masculino", value: "Masculino" },
    { label: "Outro", value: "Outro" },
    { label: "Prefiro não responder", value: "Prefiro não responder" },
  ];

  const completionElementarySchoolCategoryOptions = [
    { label: "Selecione uma opção", value: "" },
    { label: "Escola pública municipal", value: "Escola pública municipal" },
    { label: "Escola pública estadual", value: "Escola pública estadual" },
    { label: "Escola particular", value: "Escola particular" },
    {
      label: "Parte em escola pública parte em escola particular",
      value: "Parte em escola pública parte em escola particular",
    },
    { label: "Supletivo", value: "Supletivo" },
    { label: "Prefiro não responder", value: "Prefiro não responder" },
  ];

  const incomeRangeOptions = useMemo(() => {
    if (!minimumWage) {
      return [
        { label: "Selecione uma opção", value: "" },
        { label: "Prefiro não responder", value: "Prefiro não responder" },
      ];
    }

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    return [
      { label: "Selecione uma opção", value: "" },
      {
        label: `Até ${formatCurrency(minimumWage / 2)} (meio salário mínimo)`,
        value: "Até meio salário mínimo",
      },
      {
        label: `De ${formatCurrency(minimumWage / 2)} a ${formatCurrency(minimumWage)} (um salário mínimo)`,
        value: "De meio a um salário mínimo",
      },
      {
        label: `De ${formatCurrency(minimumWage)} a ${formatCurrency(minimumWage * 2)} (dois salários mínimos)`,
        value: "De um a dois salários mínimos",
      },
      {
        label: `De ${formatCurrency(minimumWage * 2)} a ${formatCurrency(minimumWage * 3)} (três salários mínimos)`,
        value: "De dois a três salários mínimos",
      },
      {
        label: `Acima de ${formatCurrency(minimumWage * 3)} (três salários mínimos)`,
        value: "Acima de três salários mínimos",
      },
      { label: "Prefiro não responder", value: "Prefiro não responder" },
    ];
  }, [minimumWage]);


  return (
    <form
      className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        Increver-se {editionName}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Nome:"
          type="text"
          placeholder="Ex: Nome Completo"
          register={register("name")}
          error={errors.name?.message}
        />
        <Field
          label="E-mail:"
          type="text"
          placeholder="Ex: nome@email.com"
          register={register("email")}
          error={errors.email?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="CPF:"
          type="text"
          placeholder="Ex: 000.000.000-00"
          mask="999.999.999-99"
          register={register("cpf")}
          error={errors.cpf?.message}
        />
        <Field
          label="Data de Nascimento:"
          type="date"
          register={register("birthDate")}
          error={errors.birthDate?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="grade"
          label="Série:"
          control={control}
          options={gradeOptions}
          error={errors.grade?.message}
        />
        <SelectField
          name="gender"
          label="Gênero:"
          control={control}
          options={genderOptions}
          error={errors.gender?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="ethnicity"
          label="Você se considera:"
          control={control}
          options={ethnicityOptions}
          error={errors.ethnicity?.message}
        />
        <SelectField
          name="bolsaFamilia"
          label="Sua família é beneficiária do Bolsa Família?"
          control={control}
          options={bolsaFamiliaOptions}
          error={errors.bolsaFamilia?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="completionElementarySchoolCategory"
          label="Onde você realizou seus estudos de ensino fundamental ou equivalente?"
          control={control}
          options={completionElementarySchoolCategoryOptions}
          error={errors.completionElementarySchoolCategory?.message}
        />
        <SelectField
          name="incomeRange"
          label="Em qual faixa de renda per capita sua família se encontra?"
          control={control}
          options={incomeRangeOptions}
          error={errors.incomeRange?.message}
        />
      </div>

      <AsyncSelect
        name="institution"
        label="Instituição:"
        placeholder="Digite para buscar a instituição..."
        control={control}
        options={institutionOptions}
        onInputChange={setInstitutionInput}
        isLoading={isInstitutionsLoading}
        error={errors.institution?.message}
      />

      <Captcha
        key={captchaResetKey}
        onVerify={setCaptchaToken}
        theme="light"
        error={captchaError}
      />

      <div className="flex justify-between">
        <Button secondary type="button" onClick={handleReset}>
          Limpar
        </Button>
        <Button type="submit" isLoading={isPending}>Inscrever-se</Button>
      </div>
    </form>
  );
};
