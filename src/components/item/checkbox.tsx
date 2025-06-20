"use client";

import type { Checkbox as CheckboxType } from "~/server/db/schema";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { updateCheckbox } from "~/server/db/actions";
import { useEffect, useState } from "react";

interface Props {
  checkbox: CheckboxType;
}

export default function CheckboxItem({ checkbox }: Props) {
  const [checked, setChecked] = useState<boolean>(!!checkbox.checked);

  const handleCheckboxChange = async (checked: boolean) => {
    setChecked(checked);
    const { success } = await updateCheckbox(checked, checkbox.id);
    if (!success) {
      setChecked(!checked);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        onCheckedChange={handleCheckboxChange}
        name={checkbox.text}
        checked={checked}
        id={checkbox.id.toString()}
      />
      <Label htmlFor={checkbox.id.toString()}>{checkbox.text}</Label>
    </div>
  );
}
