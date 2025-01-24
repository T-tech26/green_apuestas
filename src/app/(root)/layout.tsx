'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "@/contexts/child_context/userContext";
import { UserData } from "@/types/globals";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


    const { user, admin, loginUserLoading, loginUser } = useUser();


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      if(!admin.label.length || typeof user !== 'object') {
        loginUser();
      }

      if(typeof user === 'object' && !loginUserLoading) {
  
        if((user as UserData)?.subscription === false) { 
  
          toast({
            description: 'You are not on subscription, please go and subscribe',
          });
  
          redirect('/activation');
        } 
        
      }

      if(admin.label.length && !loginUserLoading) { redirect('/dashboard') }

    }, [loginUserLoading, user, admin]);
    /* eslint-enable react-hooks/exhaustive-deps */


    if((!admin.label.length || typeof user !== 'object') && loginUserLoading) {
      return (
        <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center">
          <Loader2 size={60} className="animate-spin text-color-30" />
        </div>
      )
    }


    return (
      <section className="flex flex-col h-screen w-full">
        <Header />
        {children}
        <Footer />
      </section>
    );
  }