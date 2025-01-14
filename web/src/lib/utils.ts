type ClassName = string | undefined | null | false;

export function cl(...classes: ClassName[] | ClassName[][]) {
  return classes
    .flat(2)
    .filter((v) => v)
    .join(" ");
}
