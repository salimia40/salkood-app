import { UserRole } from "db";
import React from "react";
import { getUser } from "../utils/user";
import { redirect } from "next/navigation";

export default async function Authenticated(
  props: React.PropsWithChildren<{
    roles?: UserRole[];
  }>,
) {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }
  if (props.roles && !props.roles.some((role) => role === user.role)) {
    return redirect("/");
  }
  return <>{props.children}</>;
}
