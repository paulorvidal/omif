import { ReportGenerator } from './ReportGenerator';

const INSTITUTION_REPORT_CONFIG = {
  all_institutions: {
    label: 'Todas as Instituições',
    defaultSelected: ['name', 'email', 'city', 'state'],
    fields: [
      { id: 'inep', label: 'Código INEP' },
      { id: 'name', label: 'Nome da Instituição' },
      { id: 'email', label: 'Email' },
      { id: 'coordinatorName', label: 'Nome do Coordenador' },
      { id: 'phone', label: 'Telefone' },
      { id: 'address', label: 'Endereço Completo' },
      { id: 'city', label: 'Cidade' },
      { id: 'state', label: 'Estado' },
    ],
  },
  edition_enrollments: {
    label: 'Inscrições da Edição',
    defaultSelected: ['institutionName', 'status', 'enrollmentDate'],
    fields: [
      { id: 'institutionName', label: 'Nome da Instituição' },
      { id: 'status', label: 'Status da Inscrição' },
      { id: 'enrollmentDate', label: 'Data da Inscrição' },
      { id: 'coordinatorName', label: 'Coordenador na Inscrição' },
    ],
  },
};

export const InstitutionReportGenerator = () => {

  const handleGenerateReport = (reportType: string, selectedFields: string[]) => {
   console.log(reportType)
   console.log(selectedFields)
  };

  return (
    <ReportGenerator
      config={INSTITUTION_REPORT_CONFIG}
      title="Gerar Relatório de Instituições"
      description="Primeiro, escolha o tipo de dados e depois selecione as colunas para exportar."
      onGenerate={handleGenerateReport}
    />
  );
};