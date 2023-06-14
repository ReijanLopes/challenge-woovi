import * as React from "react";
import { useMemo } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { createEnvironment } from "./environment";

export default function RelayEnvironment({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const env = useMemo(() => createEnvironment(), []);

  return (
    <RelayEnvironmentProvider environment={env}>
      {children}
    </RelayEnvironmentProvider>
  );
}
