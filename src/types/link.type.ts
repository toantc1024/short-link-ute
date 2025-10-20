export type Link = {
  id: string;
  user_id?: string;
  original_url: string;
  short_code?: string;
  click_count?: number;
  last_clicked_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
};
