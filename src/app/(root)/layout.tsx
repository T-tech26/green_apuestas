import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


    return (
      <section className="flex flex-col h-screen w-full">
        <Header />
        {children}
        <Footer />
      </section>
    );
  }