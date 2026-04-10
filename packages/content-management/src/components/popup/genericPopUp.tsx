import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export type GenericPopUpType = "Alert" | "Error" | "Success";

export function GenericPopUp({
  message,
  type,
  openGenericModal,
  setOpenGenericModal,
  title,
}: {
  message: string;
  type: GenericPopUpType;
  openGenericModal: boolean;
  setOpenGenericModal: () => void;
  title?: string;
}) {
  const computedTitle =
    title ?? (type === "Error" ? "Error" : type === "Success" ? "Success" : "Alert");

  return (
    <Dialog open={openGenericModal} onClose={setOpenGenericModal} maxWidth="xs" fullWidth>
      <DialogTitle>{computedTitle}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={setOpenGenericModal}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

