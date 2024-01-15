"use client";
import {
  createAppointment,
  updateAppointment,
} from "@/bin/actions/appointments";
import UserSelect from "@/bin/components/select/UserSelect";
import {
  ActionIcon,
  Button,
  InputWrapper,
  Stack,
  Text,
  Input,
  Tooltip,
  Select,
  Textarea,
  NumberInput,
  Group,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconCalendarPlus, IconEdit } from "@tabler/icons-react";
import { Drawer } from "antd";
import format from "date-fns-jalali/format";
import parse from "date-fns-jalali/parse";
import { Appointment, AppointmentStatus } from "db";
import React, { useCallback } from "react";
import { IMaskInput } from "react-imask";
import { z } from "zod";
import { NoteDrawerButton } from "./NoteDrawer";

type FormValues = {
  date: string;
  note: string;
  status: AppointmentStatus;
  durationMinutes: number;
  staffId: string;
};

const getInitialValues = (appointment?: Appointment) => {
  if (appointment) {
    return {
      date: format(appointment.dateTime, "yyyy/MM/dd HH:mm"),
      note: appointment.note || "",
      status: appointment.status,
      durationMinutes: appointment.durationMinutes || 0,
      staffId: appointment.staffId,
    };
  } else {
    return {
      date: format(new Date(), "yyyy/MM/dd HH:mm"),
      note: "",
      status: AppointmentStatus.SCHEDULED,
      durationMinutes: 0,
      staffId: "",
    };
  }
};

function AppointmentDrawer({
  userId,
  isOpen,
  onClose,
  mode = "create",
  appointment,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment;
  mode?: "create" | "edit";
}) {
  const form = useForm<FormValues>({
    initialValues: getInitialValues(mode === "edit" ? appointment : undefined),
    validate: zodResolver(
      z.object({
        date: z
          .string()
          .regex(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2}$/),
        note: z.string(),
        status: z.enum(["SCHEDULED", "STARTED", "FINISHED", "CANCELLED"]),
        durationMinutes: z.number().min(1, "مدت باید بزرگتر از صفر باشد"),
        staffId: z.string().min(1, "کارشناس را انتخاب کنید"),
      }),
    ),
  });

  const handleSubmit = useCallback(async () => {
    const data = form.values;
    const validationRes = form.validate();
    if (validationRes.hasErrors) return;

    if (mode === "create") {
      await createAppointment({
        userId: userId,
        staffId: data.staffId,
        date: parse(data.date, "yyyy/MM/dd HH:mm", new Date()),
        durationMinutes: data.durationMinutes,
        note: data.note,
        status: data.status,
      });
    } else {
      updateAppointment({
        staffId: data.staffId,
        date: parse(data.date, "yyyy/MM/dd HH:mm", new Date()),
        durationMinutes: data.durationMinutes,
        note: data.note,
        status: data.status,
        id: appointment!.id,
      });
    }

    onClose();
  }, [appointment, form, mode, onClose, userId]);

  return (
    <Drawer
      title={<Text>{mode === "create" ? "افزودن ویزیت" : "ویرایش ویزیت"}</Text>}
      placement="right"
      closable={true}
      onClose={onClose}
      open={isOpen}
      extra={
        <>
          <Button variant="outline" onClick={handleSubmit}>
            {mode === "create" ? "افزودن ویزیت" : "ویرایش ویزیت"}
          </Button>
        </>
      }
      footer={
        mode === "edit" && (
          <Group>
            <NoteDrawerButton userId={userId} appointmentId={appointment?.id} />
          </Group>
        )
      }
    >
      <Stack mt="xl">
        <InputWrapper label="کارشناس" {...form.getInputProps("staffId")}>
          <UserSelect
            value={form.getInputProps("staffId").value}
            onChange={form.getInputProps("staffId").onChange}
          />
        </InputWrapper>
        <InputWrapper label="تاریخ و زمان">
          <Input
            component={IMaskInput}
            mask="0000/00/00 00:00"
            w={"100%"}
            placeholder="تاریخ و زمان"
            {...form.getInputProps("date")}
            style={{ textAlign: "left", direction: "ltr" }}
          />
        </InputWrapper>
        <NumberInput label="مدت" {...form.getInputProps("durationMinutes")} />
        <Select
          placeholder="وضعیت"
          {...form.getInputProps("status")}
          label="وضعیت"
          data={[
            { value: "SCHEDULED", label: "در انتظار" },
            { value: "STARTED", label: "در حال انجام" },
            { value: "FINISHED", label: "انجام شده" },
            { value: "CANCELLED", label: "لغو شده" },
          ]}
          comboboxProps={{ withinPortal: false }}
        />
        <Textarea
          label="یادداشت"
          {...form.getInputProps("note")}
          minRows={3}
          maxRows={7}
        />
      </Stack>
    </Drawer>
  );
}

export default function AppointmentDrawerButton({
  userId,
}: {
  userId: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        افزودن ویزیت
      </Button>
      <AppointmentDrawer
        userId={userId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export function AppointmentDrawerAction({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Tooltip label="افزودن ویزیت">
        <ActionIcon
          onClick={() => setIsOpen(true)}
          variant="subtle"
          color="gray.7"
        >
          <IconCalendarPlus size={"1.5rem"} />
        </ActionIcon>
      </Tooltip>
      <AppointmentDrawer
        userId={userId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export const EditAppointmentDrawer = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <ActionIcon onClick={() => setIsOpen(true)} variant="subtle">
        <IconEdit size={"0.8rem"} />
      </ActionIcon>
      <AppointmentDrawer
        userId={appointment.userId}
        appointment={appointment}
        mode="edit"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
