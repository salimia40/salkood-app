"use client";
import React, { PropsWithChildren } from "react";
import { Provider } from "jotai";

import fa_IR from "antd/lib/locale/fa_IR";
import { App, ConfigProvider } from "antd";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";

const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);
  useServerInsertedHTML(() => {
    // avoid duplicate css insert
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider>
      <ConfigProvider locale={fa_IR} direction="rtl">
        <App>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </App>
      </ConfigProvider>
    </Provider>
  );
}
