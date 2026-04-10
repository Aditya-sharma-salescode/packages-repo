import React, { useRef } from "react";

export default function GenericFileUpload({
  onFileSelected,
  accept,
  label = "Choose file",
}: {
  onFileSelected?: (file: File | null) => void;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #ddd",
          background: "white",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => onFileSelected?.(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

