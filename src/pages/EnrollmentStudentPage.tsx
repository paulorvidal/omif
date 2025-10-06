import { useParams } from "react-router-dom";
import { useStudentPage } from "../hooks/useStudentPage";
import { EnrollmentStudentForm } from "../components/form/EnrollmentStudentForm";
import { AppCard } from "@/components/app-card";
import { formatDate } from "@/utils/formatDate";

const EnrollmentClosedMessage = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return (
    <AppCard
      title="Esta edição não está recebendo inscrições no momento."
      description={`As inscrições estarão abertas entre ${formatDate(startDate)} e ${formatDate(endDate)}.`}
      type="error"
    />
  );
};

export const EnrollmentStudentPage = () => {
  const { editionYear } = useParams<{ editionYear: string }>();
  const {
    data: editionStatus,
    isLoading,
    isError,
    isSuccess,
  } = useStudentPage(editionYear);

  if (isLoading) {
    return <div>Carregando informações da edição...</div>;
  }

  if (isError) {
    return <div>Ocorreu um erro ao carregar os dados da edição.</div>;
  }

  if (isSuccess) {
    return !editionStatus.isStudentEnrollmentOpen ? (
      <EnrollmentStudentForm
        minimumWage={editionStatus.minimumWage}
        editionName={editionStatus.name}
        editionYear={editionStatus.year}
      />
    ) : (
      <div className="flex w-screen items-center justify-center p-4 md:p-8">
        <EnrollmentClosedMessage
          startDate={editionStatus.studentRegistrationStartDate}
          endDate={editionStatus.studentRegistrationEndDate}
        />
      </div>
    );
  }

  return null;
};
