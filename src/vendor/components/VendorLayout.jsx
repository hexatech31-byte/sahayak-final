import React, { useState } from 'react';
import { VendorSidebar } from './VendorSidebar';
import { VendorHeader } from './VendorHeader';


export const VendorLayout = ({ title, subtitle, children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      <VendorSidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <VendorHeader title={title} subtitle={subtitle} onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
