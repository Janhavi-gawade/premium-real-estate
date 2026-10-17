import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg";
}

/**
 * Compresses an image file on the client using HTML5 Canvas.
 * Reduces 10MB+ phone or camera photos to crisp ~100-200KB WebP or JPEG Data URLs.
 */
export async function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    mimeType = "image/webp",
  } = options;

  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file is not an image."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Downscale proportionally if larger than maximum bounds
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback to raw data url if 2d context unavailable
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fallback to jpeg if webp produces empty or unsupported
        let dataUrl = canvas.toDataURL(mimeType, quality);
        if (!dataUrl || dataUrl.startsWith("data:,") || dataUrl.length < 50) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error(`Failed to decode image file: ${file.name}`));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Converts a data URL string to a Blob
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/webp";
  const binaryStr = atob(parts[1]);
  const len = binaryStr.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads a local file:
 * 1. Compresses via canvas to WebP/JPEG
 * 2. If Supabase Storage is configured, uploads to the 'property-images' bucket
 * 3. Falls back to compressed Base64 Data URL if Supabase is offline or unconfigured
 */
export async function uploadOrCompressImage(
  file: File,
  bucketName: string = "property-images"
): Promise<string> {
  const compressedDataUrl = await compressImageFile(file);

  // If Supabase is active, attempt to upload to storage bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const ext = file.name.split(".").pop() || "webp";
      const sanitizedName = file.name
        .substring(0, 20)
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();
      const fileName = `${Date.now()}_${sanitizedName}.${ext}`;
      const blob = dataUrlToBlob(compressedDataUrl);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`uploads/${fileName}`, blob, {
          cacheControl: "3600",
          upsert: true,
          contentType: blob.type,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);

        if (publicData?.publicUrl) {
          return publicData.publicUrl;
        }
      }
    } catch (err) {
      console.warn("Supabase Storage upload bypassed, using high-quality compressed Data URL:", err);
    }
  }

  return compressedDataUrl;
}

/**
 * Process multiple files sequentially or in parallel with progress reporting
 */
export async function processMultipleImageFiles(
  files: FileList | File[],
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const fileArray = Array.from(files);
  const results: string[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    try {
      const url = await uploadOrCompressImage(file);
      results.push(url);
    } catch (err) {
      console.error(`Failed to process image ${file.name}:`, err);
    }
    if (onProgress) {
      onProgress(i + 1, fileArray.length);
    }
  }

  return results;
}
