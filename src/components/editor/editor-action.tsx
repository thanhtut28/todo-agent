import { Button } from "../ui/button";

interface Props {
  onSave: () => void;
  onCancel: () => void;
  isSaveBtnDisabled?: boolean;
}

export default function EditorAction({
  onSave,
  onCancel,
  isSaveBtnDisabled,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={onSave} disabled={isSaveBtnDisabled}>
        Save Changes
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
