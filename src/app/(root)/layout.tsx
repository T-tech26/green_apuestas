'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/child_context/userContext";
import { UserData } from "@/types/globals";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


    const [isSubscriptionCheck, setIsSubscriptionCheck] = useState(true);
    
    const { user, admin, isLoading } = useUser();


    useEffect(() => {
      const loggIn = async () => {
        if(typeof admin === 'object' || typeof user === 'object') {
          
          if((user as UserData)?.subscription === false) { 

            setIsSubscriptionCheck(false);

            toast({
              description: 'You are not on subscription, please go and subscribe',
            });
    
            setTimeout(() => {
              redirect('/subscription');
            }, 4000);
          } 
  
          if(admin.label[0] === 'admin') { redirect('/dashboard') }

          setIsSubscriptionCheck(false);
        }
        if(!isLoading) setIsSubscriptionCheck(false);
      }

      loggIn()
    }, [user, admin, isLoading])


    if(isSubscriptionCheck && typeof user !== 'object') {
      return (
        <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center">
          <Loader2 size={60} className="animate-spin text-color-30" />
        </div>
      );
    }


    return (
      <section className="flex flex-col h-screen w-full">
        <Header />
        {children}
        <Footer />
      </section>
    );
  }