'use client'

import ProfileHeader from "@/components/ProfileHeader";
import ProfileMenu from "@/components/ProfileMenu";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


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