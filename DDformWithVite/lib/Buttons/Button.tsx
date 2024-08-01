import React from "react";

export const Button: React.FC = ({
  children,
}: React.PropsWithChildren<object>) => {
  return <button>{children}</button>;
};
