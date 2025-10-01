import Image from "next/image";
import AuthNav from "./components/nav";
import TabAuth from "./components/tab-auth/TabAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen flex flex-col gap-6">
            <AuthNav />
            
            <div className="flex flex-1 flex-col justify-center items-center px-4">
                <TabAuth>
                    {children}
                </TabAuth>
            </div>
        </section>
    );
}