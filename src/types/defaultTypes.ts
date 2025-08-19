export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements?: number;
  size?: number;
  number?: number;
};

export type PageParams = {
  page: number;
  size: number;
  q?: string;
  sort?: string;
}