import {
  AppShellMain,
  Divider,
  Group,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import React, { Suspense } from "react";
import GoodDrawer from "./ServiceDrawer";
import Search from "../../../../bin/components/Search";
import GoodsTable from "./ServicesTable";

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
          <Title order={3}>محصولات</Title>
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
          <GoodsTable query={query} page={currentPage} />
        </Suspense>
      </Stack>
    </AppShellMain>
  );
}

export default Page;
