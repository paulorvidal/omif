import { useParams } from "react-router-dom";
import { useStudentPage } from "../hooks/useStudentPage";
import { EnrollmentStudentForm } from "../components/form/EnrollmentStudentForm";

const EnrollmentClosedMessage = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    return (
        <div>
            {startDate} - {endDate}
            <h2>Inscrições Encerradas</h2>
        </div>
    );
};

export const EnrollmentStudentPage = () => {
    const { editionYear } = useParams<{ editionYear: string }>();
    const { data: editionStatus, isLoading, isError, isSuccess } = useStudentPage(editionYear);

    if (isLoading) {
        return <div>Carregando informações da edição...</div>;
    }

    if (isError) {
        return <div>Ocorreu um erro ao carregar os dados da edição.</div>;
    }

    if (isSuccess) {
        return editionStatus.isStudentEnrollmentOpen ? (
            <EnrollmentStudentForm
                minimumWage={editionStatus.minimumWage}
                editionName={editionStatus.name}
                editionYear={editionStatus.year} />
        ) : (
            <EnrollmentClosedMessage
                startDate={editionStatus.studentRegistrationStartDate}
                endDate={editionStatus.studentRegistrationEndDate}
            />
        );
    }

    return null;
};