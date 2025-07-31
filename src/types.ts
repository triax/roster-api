// Type definitions for roster data
interface Member {
  timestamp: string;
  name: {
    default: string; // Japanese name
    hiragana: string;
    alphabet: string;
  };
  position: string;
  jersey?: string;
  height?: string;
  weight?: string;
  birthdate?: string;
  next_introduction: string;
  role: string;
  photos: {
    serious: string;
    casual: string[]; // comma-separated URLs
  };
  workplace?: string;
  university: string;
  enthusiasm: string;
  watchme: string;
  hobbies: string;
  favorite: string;
  gifts: string;
  what_i_like_about_triax: string;
}

interface APIResponse<T> {
  success: boolean;
  code: number;
  data?: T;
  error?: string;
  count?: number;
}