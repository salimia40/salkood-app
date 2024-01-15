import React from "react";
import { AdminNavbar } from "./AdminNavbar";
import Authenticated from "@/bin/components/Authenticated";

function Layout(props: React.PropsWithChildren) {
  return (
    <Authenticated roles={["ADMIN"]}>
      <AdminNavbar>{props.children}</AdminNavbar>
    </Authenticated>
  );
}

export default Layout;
