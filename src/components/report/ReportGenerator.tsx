import { useState, useMemo } from "react";
import { Button } from "../Button";
import { Download, Check } from "lucide-react";

type ReportField = {
  id: string;
  label: string;
};

type ReportOption = {
  label: string;
  defaultSelected: string[];
  fields: ReportField[];
};

type ReportConfig = {
  [key: string]: ReportOption;
};

type FieldRowProps = {
  id: string;
  label: string;
  isChecked: boolean;
  onFieldChange: (id: string) => void;
};

const FieldRow = ({ id, label, isChecked, onFieldChange }: FieldRowProps) => (
  <label
    htmlFor={id}
    className={`flex w-full cursor-pointer items-center rounded-lg border-2 p-4 transition-all duration-200 ${isChecked ? "border-green-500 bg-green-50 shadow-sm" : "border-slate-200 bg-white hover:border-green-400"}`}
  >
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      onChange={() => onFieldChange(id)}
      className="sr-only"
    />
    <div
      className={`mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${isChecked ? "border-green-600 bg-green-600" : "border-slate-300 bg-white"}`}
    >
      {isChecked && <Check size={16} className="text-white" />}
    </div>
    <span
      className={`text-base transition-colors duration-200 ${isChecked ? "font-semibold text-green-900" : "text-slate-700"}`}
    >
      {label}
    </span>
  </label>
);

type ReportTypeSelectorProps = {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: (id: string) => void;
};

const ReportTypeSelector = ({
  id,
  label,
  isChecked,
  onChange,
}: ReportTypeSelectorProps) => (
  <label
    htmlFor={id}
    className={`flex w-full cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${isChecked ? "border-green-500 bg-green-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
  >
    <input
      id={id}
      type="radio"
      name="reportType"
      checked={isChecked}
      onChange={() => onChange(id)}
      className="sr-only"
    />
    <div
      className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200 ${isChecked ? "border-green-600" : "border-slate-300"}`}
    >
      <div
        className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 ${isChecked ? "scale-100 bg-green-600" : "scale-0 bg-white"}`}
      />
    </div>
    <span
      className={`text-sm font-medium transition-colors ${isChecked ? "text-green-900" : "text-slate-800"}`}
    >
      {label}
    </span>
  </label>
);

type ReportTypeStepProps = {
  config: ReportConfig;
  selectedType: string;
  onTypeChange: (type: string) => void;
};

const ReportTypeStep = ({
  config,
  selectedType,
  onTypeChange,
}: ReportTypeStepProps) => (
  <section className="flex flex-col gap-3">
    <h3 className="text-base font-semibold text-slate-700">
      1. Escolha o tipo de dados para o relatório
    </h3>
    <div className="flex flex-col gap-3 sm:flex-row">
      {Object.entries(config).map(([type, { label }]) => (
        <ReportTypeSelector
          key={type}
          id={type}
          label={label}
          isChecked={selectedType === type}
          onChange={onTypeChange}
        />
      ))}
    </div>
  </section>
);

type FieldSelectionStepProps = {
  fields: ReportField[];
  selectedFields: string[];
  onFieldChange: (fieldId: string) => void;
};

const FieldSelectionStep = ({
  fields,
  selectedFields,
  onFieldChange,
}: FieldSelectionStepProps) => (
  <section className="flex flex-col gap-3">
    <h3 className="text-base font-semibold text-slate-700">
      2. Selecione as colunas
    </h3>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {fields.map((field) => (
        <FieldRow
          key={field.id}
          id={field.id}
          label={field.label}
          isChecked={selectedFields.includes(field.id)}
          onFieldChange={onFieldChange}
        />
      ))}
    </div>
  </section>
);

type ReportGeneratorFooterProps = {
  selectedCount: number;
  totalCount: number;
  onGenerate: () => void;
};

const ReportGeneratorFooter = ({
  selectedCount,
  totalCount,
  onGenerate,
}: ReportGeneratorFooterProps) => (
  <footer className="flex items-center justify-between">
    <div className="text-sm text-slate-600">
      <span className="font-semibold text-green-700">{selectedCount}</span> de{" "}
      {totalCount} campos selecionados.
    </div>
    <Button
      onClick={onGenerate}
      disabled={selectedCount === 0}
      icon={<Download size={18} />}
      className="bg-green-600 font-semibold text-white hover:bg-green-700"
    >
      Exportar CSV
    </Button>
  </footer>
);

export type ReportGeneratorProps = {
  config: ReportConfig;
  title: string;
  description: string;
  onGenerate: (reportType: string, selectedFields: string[]) => void;
};

export const ReportGenerator = ({
  config,
  title,
  description,
  onGenerate,
}: ReportGeneratorProps) => {
  const initialReportType = Object.keys(config)[0];

  const [reportType, setReportType] = useState<string>(initialReportType);
  const [selectedFields, setSelectedFields] = useState<string[]>(
    config[initialReportType].defaultSelected,
  );

  const currentReport = useMemo(() => config[reportType], [config, reportType]);

  const handleFieldChange = (fieldId: string) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(fieldId)
        ? prevFields.filter((id) => id !== fieldId)
        : [...prevFields, fieldId],
    );
  };

  const handleReportTypeChange = (newType: string) => {
    setReportType(newType);
    setSelectedFields(config[newType].defaultSelected);
  };

  const handleGenerateClick = () => {
    if (selectedFields.length === 0) {
      alert("Por favor, selecione pelo menos um campo para exportar.");
      return;
    }
    onGenerate(reportType, selectedFields);
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <h2 className="text-2xl font-bold text-green-800">{title}</h2>
        <p className="mt-1 text-slate-500">{description}</p>
      </header>

      <hr className="border-slate-200" />

      <ReportTypeStep
        config={config}
        selectedType={reportType}
        onTypeChange={handleReportTypeChange}
      />

      <FieldSelectionStep
        fields={currentReport.fields}
        selectedFields={selectedFields}
        onFieldChange={handleFieldChange}
      />

      <hr className="border-slate-200" />

      <ReportGeneratorFooter
        selectedCount={selectedFields.length}
        totalCount={currentReport.fields.length}
        onGenerate={handleGenerateClick}
      />
    </div>
  );
};
