import { EducatorTable } from "./educator-table";
import { AppButton } from "@/components/app-button";
import { ChevronLeft, GraduationCap } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEducatorTable } from "@/hooks/use-educator-table";
import {
    AppTabs,
    AppTabsContent,
    AppTabsList,
    AppTabsTrigger,
} from "@/components/app-tabs";

type ActiveTab = "all" | "reports";

const getValidTab = (tab: string | null): ActiveTab => {
    if (tab === "reports") {
        return tab;
    }
    return "all";
};

function EducatorsPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = getValidTab(searchParams.get("tab"));

    const tableProps = useEducatorTable();

    const handleTabChange = (tab: ActiveTab) => {
        if (tab === "all") {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("tab");
            setSearchParams(newParams);
        } else {
            setSearchParams({ tab });
        }
    };

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

                <div className="flex items-center gap-2">
                    <GraduationCap className="text-primary size-8" />
                    <h1 className="text-3xl font-semibold">Educadores</h1>
                </div>
            </div>

            <AppTabs
                defaultValue="all"
                value={activeTab}
                onValueChange={(value) => handleTabChange(value as ActiveTab)}
            >
                <AppTabsList>
                    <AppTabsTrigger value="all" count={tableProps.totalElements}>
                        Todos
                    </AppTabsTrigger>
                    <AppTabsTrigger value="reports">Relatórios</AppTabsTrigger>
                </AppTabsList>

                <AppTabsContent value="all">
                    {activeTab === "all" ? <EducatorTable {...tableProps} /> : null}
                </AppTabsContent>

                <AppTabsContent value="reports">
                    {activeTab === "reports" ? (
                        <div className="py-10 text-center text-muted-foreground">
                            Área de relatórios (Em breve)
                        </div>
                    ) : null}
                </AppTabsContent>
            </AppTabs>
        </>
    );
}

export { EducatorsPage };