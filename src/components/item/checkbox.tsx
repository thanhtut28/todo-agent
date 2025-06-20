import type { Checkbox as CheckboxType } from "~/server/db/schema";
import { Checkbox } from "../ui/checkbox";

interface Props {
  checkbox: CheckboxType;
}

export default function CheckboxItem({ checkbox }: Props) {
  return (
    <div>
      <Checkbox checked={!!checkbox.checked} />
    </div>
  );
}
