// src/components/StepsForm.tsx

// Importações apenas dos seus componentes de UI existentes
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { ProgressDialog } from "../ui/ProgressDialog";

// --- Componentes visuais auxiliares (autossuficientes) ---

// Cabeçalho que aceita um objeto genérico, sem precisar do tipo "Edition"
const EditionDisplayHeader = ({ edition }: { edition: any }) => {
  // Função de formatação de data com verificação de segurança
  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não informada";
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) return "Data inválida";
    
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mb-8 rounded-lg border bg-slate-50 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800">{edition?.name || "Edição sem nome"}</h2>
      <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-600 sm:grid-cols-2 md:grid-cols-3">
        <div><strong>Ano:</strong> {edition?.year || "N/A"}</div>
        <div><strong>Salário Mínimo:</strong> R$ {String(edition?.minimumWage || '0').replace('.', ',')}</div>
        <div><strong>Vigência:</strong> {formatDate(edition?.startDate)} até {formatDate(edition?.endDate)}</div>
        <div className="col-span-full"><strong>Inscrições:</strong> {formatDate(edition?.registrationStartDate)} até {formatDate(edition?.registrationEndDate)}</div>
      </div>
    </div>
  );
};

// Indicador de progresso das etapas
const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="mb-6 text-center text-sm font-semibold text-gray-600 tracking-wider">
    ETAPA {current + 1} DE {total}
  </div>
);


// --- Componente Principal ---

// As props agora usam tipos genéricos para evitar importações externas
export const StepsForm = ({
  errors,
  isEditMode,
  isPending,
  isEditionLoading,
  register,
  handleFormSubmit,
  handleReset,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  editionData,
}: {
  errors: any;
  isEditMode: boolean;
  isPending: boolean;
  isEditionLoading: boolean;
  register: any;
  handleFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleReset: () => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  editionData?: any; // Usando 'any' para máxima compatibilidade
}) => {

  const isLoading = isPending || (isEditMode && isEditionLoading);

  return (
    <div className="w-full">
      {/* Cabeçalho de informações da edição */}
      {isEditMode && editionData && <EditionDisplayHeader edition={editionData} />}

      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-6">
        {isEditMode ? "Alterar Edição" : "Cadastrar Nova Edição"}
      </h2>
      
      {/* Formulário em Etapas */}
      <form
        className="flex w-full flex-col justify-center gap-4"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <StepIndicator current={currentStep} total={totalSteps} />

        {/* ETAPA 1: Dados Gerais e Vigência */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Dados Gerais e Vigência</h3>
            <Field
              label="Nome da Edição:"
              type="text"
              placeholder="Ex: Omif 2025"
              register={register("name")}
              error={errors.name?.message}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Ano de Referência:"
                type="number"
                placeholder="Ex: 2025"
                register={register("year")}
                error={errors.year?.message}
              />
              <Field
                label="Salário Mínimo (R$):"
                type="text"
                placeholder="Ex: 1550,00"
                register={register("minimumWage")}
                error={errors.minimumWage?.message}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Início da Vigência:"
                  type="datetime-local"
                  register={register("startDate")}
                  error={errors.startDate?.message}
                />
                <Field
                  label="Fim da Vigência:"
                  type="datetime-local"
                  register={register("endDate")}
                  error={errors.endDate?.message}
                />
            </div>
          </div>
        )}

        {/* ETAPA 2: Período de Inscrição */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Período de Inscrição</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Início das Inscrições:"
                type="datetime-local"
                register={register("registrationStartDate")}
                error={errors.registrationStartDate?.message}
              />
              <Field
                label="Fim das Inscrições:"
                type="datetime-local"
                register={register("registrationEndDate")}
                error={errors.registrationEndDate?.message}
              />
            </div>
          </div>
        )}

        {/* Controles de Navegação das Etapas */}
        <div className="mt-8 flex justify-between border-t pt-6">
          <div>
            {currentStep > 0 ? (
              <Button secondary type="button" onClick={prevStep} disabled={isLoading}>
                Voltar
              </Button>
            ) : (
               <Button secondary type="button" onClick={handleReset} disabled={isLoading}>
                  Limpar
               </Button>
            )}
          </div>
          <div>
            {currentStep < totalSteps - 1 ? (
              <Button type="button" onClick={nextStep} disabled={isLoading}>
                Avançar
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isEditMode ? "Salvar Alterações" : "Cadastrar Edição"}
              </Button>
            )}
          </div>
        </div>

        <ProgressDialog open={isLoading} />
      </form>
    </div>
  );
};