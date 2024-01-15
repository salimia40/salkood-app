"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import React from "react";
import { logout } from "../actions/auth";

export default function HeaderLogOut() {
  return (
    <Tooltip label="خروج">
      <ActionIcon
        variant="subtle"
        key="logout"
        color="pink"
        onClick={() => {
          logout({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            endpoint: window._SUB_ENDPOINT!,
          });
        }}
      >
        <IconLogout />
      </ActionIcon>
    </Tooltip>
  );
}
