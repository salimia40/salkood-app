"use client";
import { Input } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import React from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  return (
    <Input
      placeholder="جستجو..."
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("query") || ""}
      leftSection={<IconSearch />}
      rightSection={<IconX onClick={() => handleSearch("")} />}
    />
  );
}
