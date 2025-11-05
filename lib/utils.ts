import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isoDate(d: Date) {
  return format(d, "yyyy-MM-dd")
}

export function timeFormat(d: Date) {
  return format(d, "HH:mm")
}