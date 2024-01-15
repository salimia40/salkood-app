import AuthButtons from "@/bin/components/AuthButtons";
import React, { Suspense } from "react";
import { Navbar } from "./Navbar";

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar
        authButtons={
          <Suspense>
            <AuthButtons />
          </Suspense>
        }
      >
        {children}
      </Navbar>
    </>
  );
}

export default Layout;
