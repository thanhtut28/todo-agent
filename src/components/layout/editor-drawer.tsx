import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

interface Props {
  children: React.ReactNode;
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditorDrawer({
  children,
  trigger,
  open,
  onOpenChange,
}: Props) {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger className="flex h-6 w-6 items-center justify-center">
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="w-full !max-w-2xl px-4 py-6">
        {/* <div className="mx-auto flex w-full max-w-lg flex-col justify-between p-4"> */}
        <DrawerHeader className="sr-only">
          <DrawerTitle>Editor Toolbox</DrawerTitle>
          <DrawerDescription>
            This is a toolbox for editing block item.
          </DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
