import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaginationItem from '@mui/material/PaginationItem';

export interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  isLoading?: boolean;
  onPageChange: (newPageIndex: number) => void;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
}

export const PaginationComponentMUI: React.FC<PaginationProps> = ({
  pageIndex,
  pageCount,
  isLoading = false,
  onPageChange,
  className = "",
  siblingCount = 0,
  boundaryCount = 1,
}) => {
  const currentPage = pageIndex + 1;

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1);
  };

  return (
    <Stack
      spacing={{ xs: 0.5, sm: 1 }}
      className={`flex-row items-left justify-center ${className}`} 
    >
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handleChange}
        disabled={isLoading}
        shape="rounded"
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        size="small"
        renderItem={(item) => (
          <PaginationItem
            {...item}
            className={`
              
              ${item.selected
                ? '!bg-green-600 !text-white !font-bold'
                : 'text-gray-700 hover:bg-gray-100'}

              ${item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : ''}

              ${(item.type === 'previous' || item.type === 'next')
                ? 'bg-white'
                : ''}

              ${(item.type === 'start-ellipsis' || item.type === 'end-ellipsis')
                ? 'pointer-events-none'
                : ''}
            `}
          />
        )}
      />
    </Stack>
  );
};