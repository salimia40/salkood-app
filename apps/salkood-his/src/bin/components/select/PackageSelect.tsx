import React from "react";
import type { SelectProps } from "antd/es/select";
import DebounceSelect from "@/bin/components/DebounceSelect";
import { getPackage, searchPackages } from "@/bin/actions/packages";

// Usage of DebounceSelect
interface SelectValue {
  label: string;
  value: string;
}

async function fetchItems(query: string): Promise<SelectValue[]> {
  return searchPackages(query).then((items) =>
    items.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  );
}

function PackageSelect(
  props: Omit<
    SelectProps<SelectValue>,
    "options" | "children" | "value" | "onChange"
  > & {
    value?: string;
    onChange?: (value: string) => void;
  },
) {
  const [_value, _setValue] = React.useState<SelectValue | undefined>();

  React.useEffect(() => {
    if (props.value) {
      getPackage(props.value).then((item) => {
        if (!item) {
          return;
        }
        _setValue({
          label: item.name,
          value: item.id,
        });
      });
    }
  }, [props.value]);

  return (
    <DebounceSelect
      placeholder="نام بسنه را انتخاب کنید"
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

export default PackageSelect;
