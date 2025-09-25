export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="h-screen flex justify-center items-center bg-gray-300">
            <div>
            {children}
            </div>
        </section>
    );
}