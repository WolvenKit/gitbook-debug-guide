import { ParentProps } from "solid-js/types/server/rendering.js";

interface ButtonProps {
  onClick?: () => void;
}

export function Button(props: ParentProps<ButtonProps>) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
