import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getSupabaseFunctionError(error: unknown, fallback: string): Promise<string> {
  const value = error as { context?: Response; message?: string; details?: string; hint?: string } | null;
  if (value?.context && typeof value.context.json === "function") {
    try {
      const body = await value.context.clone().json();
      if (body?.error || body?.message) return `${fallback}: ${body.error ?? body.message}`;
    } catch {
      // The response may not contain JSON.
    }
  }
  const detail = [value?.message, value?.details, value?.hint].filter(Boolean).join(" — ");
  return detail ? `${fallback}: ${detail}` : fallback;
}
