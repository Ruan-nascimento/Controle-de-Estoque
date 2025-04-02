import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {PrismaClient} from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const prisma = new PrismaClient()