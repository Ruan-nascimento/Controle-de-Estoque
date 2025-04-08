import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "O nome do item é obrigatório"),
  type: z.string().min(1, "O tipo do item é obrigatório"),
  qtd: z.number().min(1, "A quantidade deve ser maior que 0"),
  value: z.number().min(0.01, "O valor deve ser maior que 0"),
  flavor: z.string().min(1, "O sabor é obrigatório"),
});

export type ItemFormData = z.infer<typeof itemSchema>;