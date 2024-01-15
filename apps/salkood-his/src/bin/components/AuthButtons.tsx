import { ActionIcon, Button, Group } from "@mantine/core";
import React from "react";
import { getUser } from "../utils/user";
import Link from "next/link";
import { IconGauge } from "@tabler/icons-react";
import HeaderLogOut from "./HeaderLogOut";

async function AuthButtons() {
  const user = await getUser();
  return (
    <Group>
      {user ? (
        <>
          <HeaderLogOut />
          <ActionIcon
            variant="subtle"
            key="dashboard"
            component={Link}
            href="/dashboard"
            color="green"
          >
            <IconGauge />
          </ActionIcon>
        </>
      ) : (
        <>
          <Button variant="default" key="login" component={Link} href="/login">
            ورود
          </Button>
          <Button key="signup" component={Link} href="/register">
            ثبت نام
          </Button>
        </>
      )}
    </Group>
  );
}

export default AuthButtons;
