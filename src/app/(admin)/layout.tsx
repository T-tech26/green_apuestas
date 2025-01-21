'use client'
import AdminHeader from "@/components/AdminHeader";
import AdminMenu from "@/components/AdminMenu";
import { useUser } from "@/contexts/child_context/userContext";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


    const { user, allUsers, admin, loginUserLoading, loginUser } = useUser();


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      if(!admin.label.length && typeof user !== 'object') {
        loginUser();
      }

        if(typeof user === 'object') { redirect('/'); }

        if(typeof user !== 'object' && !loginUserLoading) { redirect('/') }

        if(!admin.label.length && !loginUserLoading) { redirect('/'); }
    }, [loginUserLoading, user, admin]);
    /* eslint-enable react-hooks/exhaustive-deps */


    if(!admin.label.length && !allUsers.length && loginUserLoading) {
      return (
        <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center">
          <Loader2 size={60} className="animate-spin text-color-30" />
        </div>
      );
    }

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