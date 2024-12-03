import AdminHeader from "@/components/AdminHeader";
import AdminMenu from "@/components/AdminMenu";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


    return (
      <section className='flex item-center h-screen overflow-hidden'>
        <AdminMenu />
        <div className="flex flex-col flex-1 overflow-hidden">
            <AdminHeader />
            {children}
        </div>
      </section>
    );
  }