import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Back" }: { label?: string }) {
  const navigate = useNavigate();
  return (
    <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
      {label}
    </Button>
  );
}

