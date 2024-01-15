import { notFound, redirect } from "next/navigation";
import React from "react";
import Appointments from "./Appointments";
import Payments from "./Payments";
import Bills from "./Bills";
import Notes from "./Notes";
/**
 * Page component that renders different tabs for a user's profile.
 *
 * Accepts the userId and tab name as props.params.
 *
 * Redirects to /dashboard/users/[userId] if tab is "profile".
 * Renders Appointments, Payments, Bills, or Notes components based on tab.
 * Returns 404 notFound() if tab doesn't match a defined tab.
 */

export default function Page(props: {
  params: {
    userId: string;
    tab: string;
  };
}) {
  const userId = props.params.userId;
  const tab = props.params.tab;

  if (tab === "profile") return redirect(`/dashboard/users/${userId}`);

  if (tab === "appointments") return <Appointments userId={userId} />;
  if (tab === "payments") return <Payments />;
  if (tab === "bills") return <Bills userId={userId} />;
  if (tab === "notes") return <Notes userId={userId} />;

  return notFound();
}
