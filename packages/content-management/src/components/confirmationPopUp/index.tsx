import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export type ConfirmationPopUpProps = {
  message: string;
  openConfirmModal: boolean;
  setOpenConfirmModal: (open: boolean) => void;
  successMethod?: () => void | Promise<void>;
  title?: string;
  confirmText?: string;
  cancelText?: string;
};

export function ConfirmationPopUp({
  message,
  openConfirmModal,
  setOpenConfirmModal,
  successMethod,
  title = "Confirm",
  confirmText = "Yes",
  cancelText = "Cancel",
}: ConfirmationPopUpProps) {
  return (
    <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenConfirmModal(false)}>{cancelText}</Button>
        <Button
          variant="contained"
          onClick={async () => {
            await successMethod?.();
            setOpenConfirmModal(false);
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

