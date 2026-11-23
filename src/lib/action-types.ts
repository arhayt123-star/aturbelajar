export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  /** Nilai sekali-tampil (mis. password sementara). Tidak disimpan di mana pun. */
  secret?: string;
  /** Isian terakhir yang dikirim (tanpa password), dipakai agar formulir tidak kosong saat gagal. */
  values?: Record<string, string>;
};
