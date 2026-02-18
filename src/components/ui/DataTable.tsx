import { type ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { TableRowSkeleton } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pageSize?: number;
  responsive?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  pageSize = 10,
  responsive = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const pagedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch?.(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="input-field pl-11"
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 shadow-soft">
        <table className="w-full text-sm block md:table">
          <thead className={responsive ? 'hidden md:table-header-group' : ''}>
            <tr className="bg-neutral-50/80 border-b border-neutral-200/80 block md:table-row">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 text-left font-semibold text-neutral-500 text-xs uppercase tracking-wider block md:table-cell ${col.sortable ? 'cursor-pointer select-none hover:text-neutral-900 transition-colors' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 block md:table-row-group">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton
                  key={i}
                  cols={columns.length}
                  className={responsive ? 'block md:table-row border-b md:border-b-0 last:border-0 border-neutral-50' : ''}
                />
              ))
            ) : pagedData.length === 0 ? (
              <tr className="block md:table-row">
                <td colSpan={columns.length} className="px-4 py-16 text-center text-neutral-500 block md:table-cell">
                  No results found
                </td>
              </tr>
            ) : (
              pagedData.map((row) => (
                <tr key={keyExtractor(row)} className={`hover:bg-neutral-50/60 transition-colors duration-150 ${responsive ? 'block md:table-row' : ''}`}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-neutral-700 ${responsive ? 'flex justify-between items-center md:table-cell border-b md:border-b-0 last:border-0 border-neutral-50' : 'table-cell'}`}
                    >
                      {responsive && (
                        <span className="md:hidden font-semibold text-neutral-500 text-xs uppercase pr-4">
                          {col.header}
                        </span>
                      )}
                      <div className={responsive ? 'text-right md:text-left flex-1' : ''}>
                        {col.render(row)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, data.length)} of {data.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-xl hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-neutral-700">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-xl hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
