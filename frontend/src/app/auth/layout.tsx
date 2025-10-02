import ThemeToggle from "@/components/theme-toggle";
import { Switch } from "@/components/ui/switch";



export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen flex flex-col gap-6">
            <header className="flex-col-reverse">
                <ThemeToggle />
            </header>
            <div className="flex-grow flex items-center justify-center flex-1">
                {children}
            </div>
            <footer className="bg-gray-50 p-1 text-center text-sm text-gray-500 dark:bg-transparent dark:text-gray-400">
                &copy; derechos reservados 2025 <br />
                <small>Developed by Raool - Juan - Cristobal</small> 
            </footer>
        </section>
    );
}