import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";

interface WrapperProps {
  children: ReactNode;
}

const AllProviders = ({ children }: WrapperProps) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
