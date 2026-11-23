import { z } from "zod";

// "" dari form dianggap tidak diisi.
export const opt = <T extends z.ZodTypeAny>(s: T) =>
  z.preprocess((v) => (v === "" || v == null ? undefined : v), s.optional());
