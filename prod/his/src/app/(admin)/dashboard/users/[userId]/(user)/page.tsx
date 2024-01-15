import { Stack } from "@mantine/core";
import React from "react";
import { prisma } from "@/bin/db";
import { notFound } from "next/navigation";
import UserProfileForm from "./UserProfileForm";
import StaffProfileForm from "./StaffProfileForm";

/**
 * Page function that gets a user by ID from params.
 * Finds user from DB and returns notFound if no user.
 * Renders UserProfileForm with user profile data.
 */
export default async function Page(props: {
  params: {
    userId: string;
  };
}) {
  const userId = props.params.userId;

  const user = await prisma.user.findUnique({
    where: {
      nationalId: userId,
    },
    include: {
      userProfile: true,
      staffProfile: true,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <Stack>
      {user.role === "USER" ? (
        <UserProfileForm
          userProfile={user.userProfile ? user.userProfile : undefined}
          userId={userId}
        />
      ) : (
        <StaffProfileForm
          staffProfile={user.staffProfile ? user.staffProfile : undefined}
          userId={userId}
        />
      )}
    </Stack>
  );
}
