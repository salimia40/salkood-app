import React from "react";
import type { SelectProps } from "antd/es/select";
import DebounceSelect from "@/bin/components/DebounceSelect";
import { getGood, searchGood } from "@/bin/actions/goods";

// Usage of DebounceSelect
interface SelectValue {
  label: string;
  value: string;
  price: number;
}

async function fetchItems(query: string): Promise<SelectValue[]> {
  return searchGood(query).then((goods) =>
    goods.map((good) => ({
      label: good.name,
      value: good.id,
      price: good.price,
    })),
  );
}

function GoodSelect(
  props: Omit<SelectProps<SelectValue>, "options" | "children" | "value"> & {
    value?: string;
    onChange?: (value: string) => void;
  },
) {
  const [_value, _setValue] = React.useState<SelectValue | undefined>();

  React.useEffect(() => {
    if (props.value) {
      getGood(props.value).then((good) => {
        if (!good) {
          return;
        }
        _setValue({
          label: good.name,
          value: good.id,
          price: good.price,
        });
      });
    }
  }, [props.value]);

  return (
    <DebounceSelect
      placeholder="نام محصول را انتخاب کنید"
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

export default GoodSelect;
