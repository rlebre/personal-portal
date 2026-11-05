import type { ComponentPropsWithoutRef, ElementType } from "react";

/** Props for a component that renders `as` any element/component, plus its own props `P`. */
export type PolymorphicProps<E extends ElementType, P = object> = P & { as?: E } & Omit<ComponentPropsWithoutRef<E>, keyof P | "as">;
