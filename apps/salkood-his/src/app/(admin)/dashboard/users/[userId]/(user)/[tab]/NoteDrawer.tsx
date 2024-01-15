"use client";
import React from "react";
import { Drawer } from "antd";
import { ActionIcon, Tooltip, Textarea, Button } from "@mantine/core";
import { IconEdit, IconNote } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { createNote, updateNote } from "@/bin/actions/notes";
import { Note } from "db";

function NoteDrawer({
  userId,
  appointmentId,
  isOpen,
  onClose,
  mode = "create",
  note,
}: {
  userId: string;
  appointmentId?: number;
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  note?: Note;
}) {
  const form = useForm({
    initialValues: {
      note: note?.content || "",
    },
    validate: {
      note: (value) => (value.length < 1 ? "یادداشت نباید خالی باشد" : null),
    },
  });

  const onSubmit = () => {
    const validated = form.validate();
    if (validated.hasErrors) return;

    if (mode === "create") {
      createNote({
        content: form.values.note,
        userId,
        appointmentId,
      });
    } else {
      updateNote({
        id: note!.id,
        content: form.values.note,
        appointmentId,
      });
    }
    onClose();
  };

  return (
    <Drawer
      title="ثبت یادداشت"
      placement="right"
      closable={true}
      width={500}
      open={isOpen}
      onClose={onClose}
      destroyOnClose
      maskClosable
      extra={
        <Button variant="outline" onClick={onSubmit}>
          ذخیره
        </Button>
      }
    >
      <Textarea
        required
        minRows={7}
        autosize
        label="یادداشت"
        {...form.getInputProps("note")}
      />
    </Drawer>
  );
}

export function NoteDrawerButton({
  userId,
  appointmentId,
}: {
  userId: string;
  appointmentId?: number;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Tooltip label="ثبت یادداشت">
        <Button
          color={"gray.7"}
          variant="subtle"
          onClick={() => setIsOpen(true)}
          leftSection={<IconNote size={"0.8rem"} />}
        >
          ثبت یادداشت
        </Button>
      </Tooltip>
      <NoteDrawer
        userId={userId}
        isOpen={isOpen}
        appointmentId={appointmentId}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export function NoteDrawerAction({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Tooltip label="ثبت یادداشت">
        <ActionIcon
          onClick={() => setIsOpen(true)}
          variant="subtle"
          color="gray.7"
        >
          <IconNote size={"1.5rem"} />
        </ActionIcon>
      </Tooltip>
      <NoteDrawer
        userId={userId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export const EditNoteDrawer = ({ note }: { note: Note }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Tooltip label="ویرایش یادداشت">
        <ActionIcon onClick={() => setIsOpen(true)} variant="subtle">
          <IconEdit size={"0.8rem"} />
        </ActionIcon>
      </Tooltip>
      <NoteDrawer
        note={note}
        appointmentId={note.appointmentId || undefined}
        userId={note.userId!}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode="edit"
      />
    </>
  );
};

export default NoteDrawer;
