"use client";
import React from "react";

import { Pagination as _Pagination } from "@mantine/core";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function Pagination({ total }: { total: number }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const page = Number(params.get("page")) || 1;

  return (
    <_Pagination
      total={total}
      value={page}
      onChange={(page) => {
        params.set("page", String(page));
        replace(`${pathname}?${params.toString()}`);
      }}
    />
  );
}
