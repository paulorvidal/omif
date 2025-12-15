import { EducatorTable } from "./educator-table";
import { AppButton } from "@/components/app-button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEducatorTable } from "@/hooks/use-educator-table";

function EducatorsPage() {
    const navigate = useNavigate();

    const tableProps = useEducatorTable();

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <AppButton
                    variant="secondary"
                    className="size-8"
                    size="icon"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="size-4" />
                </AppButton>
                <h1 className="text-3xl font-semibold">Educadores</h1>
            </div>

            <div className="w-full">
                <EducatorTable {...tableProps} />
            </div>
        </>
    );
}

export { EducatorsPage };