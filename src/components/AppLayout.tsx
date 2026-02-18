import { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      {/* Desktop: offset by sidebar width. Mobile: offset by top header height */}
      <main className="md:ml-64 pt-14 md:pt-0 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
