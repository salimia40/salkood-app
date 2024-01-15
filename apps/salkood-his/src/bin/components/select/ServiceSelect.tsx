import React from "react";
import type { SelectProps } from "antd/es/select";
import { getService, searchService } from "@/bin/actions/services";
import DebounceSelect from "@/bin/components/DebounceSelect";

// Usage of DebounceSelect
interface SelectValue {
  label: string;
  value: string;
  price: number;
}

async function fetchItems(query: string): Promise<SelectValue[]> {
  return searchService(query).then((services) => {
    return services.map((service) => ({
      label: service.name,
      value: service.id,
      price: service.price,
    }));
  });
}

function ServiceSelect(
  props: Omit<SelectProps<SelectValue>, "options" | "children" | "value"> & {
    value?: string;
    onChange?: (value: string) => void;
  },
) {
  const [_value, _setValue] = React.useState<SelectValue | undefined>();

  React.useEffect(() => {
    if (props.value && props.value !== "") {
      getService(props.value).then((service) => {
        if (!service) {
          return;
        }
        _setValue({
          label: service.name,
          value: service.id,
          price: service.price,
        });
      });
    }
  }, [props.value]);

  return (
    <DebounceSelect<SelectValue>
      placeholder="نام خدمت را انتخاب کنید"
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

export default ServiceSelect;
