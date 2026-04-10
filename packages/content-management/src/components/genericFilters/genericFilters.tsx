import { Button } from "@mui/material";
import React from "react";

export default function GenericFilters(_props: any) {
  // Placeholder implementation for package isolation.
  // Consumers can wrap/replace this with their own filter UI.
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Button size="small" variant="outlined">
        Filters
      </Button>
    </div>
  );
}

