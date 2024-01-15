"use client";

import { IconNote } from "@tabler/icons-react";
import { List } from "antd";
import { format } from "date-fns-jalali";
import { Note } from "db";
import React from "react";

export default function NotesList({ notes }: { notes: Note[] }) {
  return (
    <List
      dataSource={notes || []}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={format(item.createdAt, "yyyy-MM-dd HH:mm")}
            description={item.content}
            avatar={<IconNote size={"1.2rem"} />}
          />
        </List.Item>
      )}
    />
  );
}
