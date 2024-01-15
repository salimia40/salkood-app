import React, { useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { Select, Spin, Typography } from "antd";
import type { SelectProps } from "antd/es/select";

export interface DebounceSelectProps<ValueType = unknown>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
    price?: number;
  },
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      showSearch
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
      optionRender={(option) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Text strong>{option.label}</Typography.Text>
          {option.data.price && (
            <Typography.Text type="secondary">
              {option.data.price.toLocaleString()} ریال
            </Typography.Text>
          )}
        </div>
      )}
    />
  );
}

export default DebounceSelect;
