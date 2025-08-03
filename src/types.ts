
export interface Photo {
  url: string;
  mime_type: string;
}

export interface Member {
  timestamp: string;
  name: {
    default: string; // Japanese name
    hiragana: string;
    alphabet: string;
  };
  position: string;
  jersey?: number;
  height?: string;
  weight?: string;
  birthdate?: string;
  next_introduction: string;
  role: string;
  photos: {
    serious: Photo;
    casual: Photo[]; // comma-separated URLs
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

export interface RosterJSON {
  version: string;
  updated_at: string;
  members: Member[];
}
