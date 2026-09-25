import { supabase } from "@/integrations/supabase/client";
import type { ScanRecord } from "./analysis.functions";

export type { ScanRecord };

export const scansQuery = {
  queryKey: ["scans"],
  queryFn: async (): Promise<ScanRecord[]> => {
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as ScanRecord[];
  },
};

export async function deleteScan(id: string) {
  const { error } = await supabase.from("scans").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function clearScans() {
  const { error } = await supabase.from("scans").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw new Error(error.message);
}

export function confidencePct(confidence: number) {
  return Math.round((confidence ?? 0) * 100);
}

export async function fileToCompressedDataUrl(file: File, maxSize = 1024): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not open that image"));
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}
