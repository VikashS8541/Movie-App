import { z } from "zod";

export const advanceFilterSchema = z.object({
  year: z.string().optional(),
  country: z.string().optional(),
  actor: z.string().optional(),
  director: z.string().optional(),
  search: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 2, {
      message: "Search must be at least 2 characters",
    }),
  categories: z.array(z.string()).default([]),
});

export const advanceFilterDefaultValues = {
  year: "",
  country: "",
  actor: "",
  director: "",
  search: "",
  categories: [],
};
