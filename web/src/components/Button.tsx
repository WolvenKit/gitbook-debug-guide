import { cl } from "$lib/utils";
import { JSX, splitProps } from "solid-js";
import { ParentProps } from "solid-js/types/server/rendering.js";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export function Button(allProps: ParentProps<ButtonProps>) {
  const [props, restProps] = splitProps(allProps, [
    "children",
    "onClick",
    "class",
  ]);

  return (
    <button
      onClick={props.onClick}
      class={cl("button", props.class)}
      {...restProps}
    >
      {props.children}
    </button>
  );
}
