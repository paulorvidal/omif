import { Navbar } from "../components/ui/Navbar";
import { Sidebar } from "../components/ui/Sidebar";
import { H2 } from "../components/ui/H2";

export const Profile = () => {

    return (
        <div className="flex pt-14 pb-14 md:pb-0">
            <Navbar />
            <Sidebar />
            <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
                <H2>Perfil</H2>
                <div className="flex pb-14 md:pb-0">
                    <div className="w-full rounded-md">
                        
                    </div>
                </div>
            </div>
        </div>
    );
};