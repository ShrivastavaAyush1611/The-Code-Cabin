// import { currentUserRole } from "@/modules/auth/actions";
// import { currentUserRole } from "../modules/auth/actions";
import { currentUserRole } from "../modules/auth/actions";
import Navbar from "../modules/home/components/Navbar";
import React from "react";

const RootLayout = async({ children }) => {
  const userRole = await currentUserRole()
  
  return (
    <div className="flex flex-col min-h-screen w-full relative">
    <Navbar userRole={userRole}/>
     
        <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] dark:bg-[size:16px_16px] bg-[radial-gradient(#dadde2_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"/>
           <main className="flex-1 flex flex-col pt-4 px-4 pb-4">
          {children}
        </main>
      </div>
    
  );
}

export default RootLayout;
