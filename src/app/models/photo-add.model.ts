export interface PhotoAdd {
  user_id: number;
  title: string;
  url?: string; // Optional jika pengguna mengupload via file
  is_public: boolean;
  uploaded_at?: Date; // Ini perlu ditambahkan untuk mendukung `uploaded_at`
}
