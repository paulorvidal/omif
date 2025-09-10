import React from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  count?: number;
}

const formatCount = (count: number): string | number => {
  if (count > 999) {
    return '999';
  }
  return count;
};

const Tab: React.FC<TabProps> = ({ label, isActive, onClick, icon, count }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ${isActive
        ? 'bg-green-100 text-green-800 font-semibold shadow-sm'
        : 'bg-white text-zinc-600 font-medium hover:bg-zinc-50'
        }`}
    >
      <span className={isActive ? 'text-green-700' : 'text-zinc-400'}>{icon}</span>
      <span>{label}</span>
      {typeof count !== 'undefined' && (
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isActive
            ? 'bg-green-600 text-white'
            : 'bg-zinc-200 text-zinc-600'
            }`}
        >
          {formatCount(count)}
        </span>
      )}
    </button>
  );
};

interface TabsContainerProps {
  children: React.ReactNode;
}

const TabsContainer: React.FC<TabsContainerProps> = ({ children }) => (
  <div className="w-full">
    <nav className="flex flex-wrap items-center gap-2">
      {children}
    </nav>
  </div>
);

export { Tab, TabsContainer };

