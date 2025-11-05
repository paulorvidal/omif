import { useEducatorForm } from "../../hooks/use-educator-form";
import { EducatorForm } from "@/components/educator/EducatorForm";

export function EducatorSignUpPage() {
    const formProps = useEducatorForm();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-6xl bg-white p-8 rounded-2xl shadow-lg">
                <EducatorForm {...formProps} />
            </div>
        </div>
    );
}
