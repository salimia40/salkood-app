import {
  AppShellMain,
  Divider,
  Group,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import React, { Suspense } from "react";
import GoodDrawer from "./PackageDrawer";
import Search from "../../../../bin/components/Search";
import PakagesTable from "./PakagesTable";

async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <AppShellMain>
      <Stack>
        <Group justify="space-between">
          <Title order={3}>لیست بسته ها</Title>
          <Group>
            <Search />
            <GoodDrawer mode="add" />
          </Group>
        </Group>
        <Divider />
        <Suspense
          key={query + currentPage}
          fallback={
            <Stack>
              <Loader my={"xl"} />
            </Stack>
          }
        >
          <PakagesTable query={query} page={currentPage} />
        </Suspense>
      </Stack>
    </AppShellMain>
  );
}

export default Page;
