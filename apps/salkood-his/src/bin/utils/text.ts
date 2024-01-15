import { ServiceType, UserRole, AppointmentStatus } from "db";

export function convertNumberToPersian(number: number) {
  return number.toLocaleString("fa-IR");
}

export const serviceTypeToPersian = (type: ServiceType) => {
  switch (type) {
    case "LAB":
      return "آزمایشگاه";
    case "PHARMACY":
      return "داروخانه";
    case "NURSE":
      return "پرستار";
    case "PHYSITION":
      return "پزشک";
    case "RADIOLOGY":
      return "رادیولوژی";
    case "SUPPORT":
      return "پشتیبانی";
    default:
      return "نامشخص";
  }
};

export const userRoleToPersian = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return "مدیر";
    case "USER":
      return "کاربر";
    case "NURSE":
      return "پرستار";
    case "PHYSITION":
      return "پزشک";
    case "SUPPORT":
      return "پشتیبانی";
    case "ADDMITION":
      return "پذیرش";
  }
};

export const appointmentStatusToPersian = (status: AppointmentStatus) => {
  switch (status) {
    case "SCHEDULED":
      return "در انتظار";
    case "STARTED":
      return "شروع شده";
    case "FINISHED":
      return "تمام شده";
    case "CANCELLED":
      return "لغو شده";
  }
};

export const beatifyPhoneNumber = (phoneNumber: string) => {
  return toPersianNumbers(
    phoneNumber.replace(/^0/, "+98-").replace(/^9/, "+98-9"),
  );
};

export const toPersianNumbers = (str: string | number) => {
  str = String(str);
  return str
    .replace(/0/g, "۰")
    .replace(/1/g, "۱")
    .replace(/2/g, "۲")
    .replace(/3/g, "۳")
    .replace(/4/g, "۴")
    .replace(/5/g, "۵")
    .replace(/6/g, "۶")
    .replace(/7/g, "۷")
    .replace(/8/g, "۸")
    .replace(/9/g, "۹");
};
