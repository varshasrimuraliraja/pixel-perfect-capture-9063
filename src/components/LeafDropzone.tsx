import { useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScanningOverlay } from "@/components/ScanningOverlay";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type Props = {
  preview: string | null;
  scanning: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
};

export function LeafDropzone({ preview, scanning, onFile, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function validateAndSend(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      toast.error("Unsupported format", { description: "Use a JPG, PNG or WEBP image." });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image too large", { description: "Maximum file size is 10 MB." });
      return;
    }
    onFile(file);
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a leaf image"
        data-testid="upload-dropzone"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          validateAndSend(event.dataTransfer.files?.[0]);
        }}
        className={`relative flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          dragging ? "border-primary bg-mint" : "border-border bg-card hover:bg-mint/60"
        }`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Selected leaf"
              className="max-h-80 w-full rounded-xl object-contain"
              data-testid="leaf-preview"
            />
            <ScanningOverlay active={scanning} />
          </>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-mint text-primary">
              <ImagePlus className="size-7" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold">Drop a leaf photo here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              JPG, PNG or WEBP · up to 10 MB · one leaf, good lighting, plain background
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          data-testid="leaf-upload-input"
          onChange={(event) => validateAndSend(event.target.files?.[0])}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          data-testid="choose-file-button"
        >
          <Upload className="size-4" />
          Choose image
        </Button>
        {preview ? (
          <Button variant="ghost" size="sm" onClick={onClear} data-testid="clear-image-button">
            <X className="size-4" />
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}
