'use client'
import ProfileHeader from "@/components/ProfileHeader";
import ProfileMenu from "@/components/ProfileMenu";
import { useUser } from "@/contexts/child_context/userContext";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


    const { user, admin, isLoading } = useUser();
    

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      if(admin.label.length) { redirect('/dashboard'); }

      if(!isLoading) {
        if(typeof user !== 'object') { redirect('/'); }
      }
    }, [user, admin]);
    /* eslint-enable react-hooks/exhaustive-deps */



    if(typeof user !== 'object' && !admin.label.length && isLoading) {
      return (
        <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center">
          <Loader2 size={60} className="animate-spin text-color-30" />
        </div>
      );
    }


    return (
      <section className='flex item-center h-screen'>
        <ProfileMenu />
          <div className="flex flex-col flex-1">
              <ProfileHeader />
              {children}
          </div>
      </section>
    );
  }