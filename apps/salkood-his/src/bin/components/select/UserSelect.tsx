import React from "react";
import type { SelectProps } from "antd/es/select";
import DebounceSelect from "@/bin/components/DebounceSelect";
import { searchUser, getUser } from "@/bin/actions/users";

// Usage of DebounceSelect
interface SelectValue {
  label: string;
  value: string;
}

async function fetchItems(query: string): Promise<SelectValue[]> {
  return searchUser({ query, role: ["ADMIN", "NURSE", "PHYSITION"] }).then(
    (users) =>
      users.map((user) => ({
        label: user.name + "",
        value: user.nationalId,
      })),
  );
}

function UserSelect(
  props: Omit<SelectProps<SelectValue>, "options" | "children"> & {
    value?: string;
    onChange?: (value: string) => void;
  },
) {
  const [_value, _setValue] = React.useState<SelectValue | undefined>();

  React.useEffect(() => {
    if (props.value) {
      getUser(props.value).then((user) => {
        if (!user) {
          return;
        }
        _setValue({
          label: user.name + "",
          value: user.nationalId,
        });
      });
    }
  }, [props.value]);

  return (
    <DebounceSelect
      placeholder="کادبر را انتخاب کنید"
      value={_value}
      onChange={(newValue) => {
        _setValue(newValue as SelectValue | undefined);
        if (props.onChange) {
          props.onChange((newValue as SelectValue | undefined)?.value ?? "");
        }
      }}
      fetchOptions={fetchItems}
      style={{ width: "100%" }}
    />
  );
}

export default UserSelect;
