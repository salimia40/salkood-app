import { Group, Title, Image } from "@mantine/core";
import React from "react";

function Logo({ size }: { size: number }) {
  return (
    <Group>
      <Image src="/logo.png" alt="" w={size} />
      <Title order={2}>Salkood</Title>
    </Group>
  );
}

export default Logo;
