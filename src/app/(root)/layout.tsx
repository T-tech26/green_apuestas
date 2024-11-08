'use client'

import { menuLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const pathName = usePathname();

    return (
      <main className="flex flex-col h-screen w-full">
        <div className="header">
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="font-medium text-color-30 tracking-wide pr-2">
                Top winners
              </h3>
              <p className="font-light text-xs text-color-30 tracking-wide border-l pl-2">
                ArthurMic won $700,000
              </p>
            </div>

            <LanguageSwitcher />
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-color-30 font">Logo</h1>
            
            <div className="hidden md:flex justify-center items-center gap-5">
              {menuLinks.map((item) => {
                
                const isActive = pathName === item.route || pathName.startsWith(`&{item.route}/`);

                return(
                  <Link
                    href={item.route}
                    key={item.label}
                    className={ isActive ? `activeMenu` : `menu` }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex justify-between items-center gap-3">

              <div className="md:flex justify-between gap-1 items-center hidden">
                <LanguageSwitcher />
              </div>

              <div className="loginbtn">Login</div>
              <div className="registerbtn">Register</div>

              <MobileNav />
            </div>
          </div>
          
        </div>

        {children}
      </main>
    );
  }