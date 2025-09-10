type PageInfo = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type PageResponse<T> = {
  content: T[];
  page: PageInfo;
};

export type PageParams = {
  page: number;
  size: number;
  q?: string;
  sort?: string;
}