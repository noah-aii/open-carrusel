export interface LibraryImage {
  id: string;
  url: string;
  name: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  createdAt: string;
}

export interface LibraryData {
  images: LibraryImage[];
}
