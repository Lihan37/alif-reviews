export type ReviewStatus = "published" | "hidden";

export interface Review {
  id: string;
  rating: number;
  review_text: string;
  name: string | null;
  phone: string | null;
  stay_anonymous: boolean;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
