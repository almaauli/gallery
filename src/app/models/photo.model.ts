export interface Photo {
  id: number; // ID wajib untuk foto yang sudah ada
  user_id: number;
  title: string;
  url: string;
  is_public: boolean;
  uploaded_at: Date; // Dapat tetap opsional jika tidak dibutuhkan saat penambahan
}
