import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  Upload,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  RefreshCw,
} from 'lucide-react';
import { Button } from './Button';
import { exportToCSV } from '../../utils/csv';
import { TableSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { useAdminStore } from '../../store/adminStore';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  filterTabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  exportFilename?: string;
  onBulkDelete?: (selectedIds: string[]) => void;
  onRowClick?: (row: T) => void;
  primaryKey?: keyof T;
  title?: string;
  subtitle?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Search records...',
  filterTabs,
  activeTab,
  onTabChange,
  exportFilename = 'export_data',
  onBulkDelete,
  onRowClick,
  primaryKey = 'id' as keyof T,
  title,
  subtitle,
}: DataTableProps<T>) {
  const { setCSVImportModalOpen, addToast } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // 1. Search & Filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (!searchTerm) return true;
      if (searchKey && item[searchKey]) {
        return ('' + item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase());
      }
      // Global object values search if searchKey not strictly specified
      return Object.values(item).some((val) =>
        ('' + (val ?? '')).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, searchKey]);

  // 2. Sort
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      const compareRes = valA < valB ? -1 : 1;
      return sortDirection === 'asc' ? compareRes : -compareRes;
    });
  }, [filteredData, sortField, sortDirection]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handlers
  const handleSort = (field?: string) => {
    if (!field) return;
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.size === paginatedData.length) {
      setSelectedRowIds(new Set());
    } else {
      const newSet = new Set<string>();
      paginatedData.forEach((row) => {
        const id = '' + row[primaryKey];
        if (id) newSet.add(id);
      });
      setSelectedRowIds(newSet);
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSet = new Set(selectedRowIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRowIds(newSet);
  };

  const handleExport = () => {
    const exportItems = selectedRowIds.size > 0
      ? data.filter(d => selectedRowIds.has('' + d[primaryKey]))
      : sortedData;
    exportToCSV(exportItems, exportFilename);
    addToast('success', `Exported ${exportItems.length} records to CSV`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('info', 'Table data refreshed');
    }, 400);
  };

  const handleBulkDeleteAction = () => {
    if (onBulkDelete && selectedRowIds.size > 0) {
      onBulkDelete(Array.from(selectedRowIds));
      setSelectedRowIds(new Set());
    }
  };

  return (
    <div className="bg-white dark:bg-matrin-darkcard border border-matrin-border dark:border-matrin-darkborder rounded-3xl shadow-card overflow-hidden transition-all duration-200">
      {/* Top Header & Toolbar */}
      <div className="p-6 border-b border-matrin-border dark:border-matrin-darkborder space-y-4">
        {(title || subtitle) && (
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-xl font-bold text-matrin-text dark:text-matrin-darktext">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-matrin-gray dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Upload className="w-4 h-4" />}
                onClick={() => setCSVImportModalOpen(true)}
              >
                Import CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExport}
              >
                Export CSV
              </Button>
            </div>
          </div>
        )}

        {/* Filter Tabs if present */}
        {filterTabs && filterTabs.length > 0 && (
          <div className="flex items-center gap-1 border-b border-matrin-border dark:border-matrin-darkborder pb-2 overflow-x-auto">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange?.(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-matrin-primary text-white shadow-soft'
                      : 'text-matrin-gray dark:text-slate-400 hover:text-matrin-text hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Search Input & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-matrin-gray dark:text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-matrin-text dark:text-matrin-darktext placeholder-matrin-gray focus:outline-none focus:ring-2 focus:ring-matrin-primary"
            />
          </div>

          {/* Bulk Action indicator */}
          {selectedRowIds.size > 0 && (
            <div className="flex items-center gap-3 bg-matrin-primary/10 border border-matrin-primary/20 px-4 py-1.5 rounded-xl">
              <span className="text-xs font-semibold text-matrin-primary dark:text-blue-400">
                {selectedRowIds.size} Selected
              </span>
              {onBulkDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={handleBulkDeleteAction}
                >
                  Delete Selected
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <TableSkeleton rows={pageSize} cols={columns.length + 1} />
        ) : sortedData.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-matrin-border dark:border-matrin-darkborder bg-matrin-bg/40 dark:bg-slate-900/40 text-xs font-semibold text-matrin-gray uppercase tracking-wider">
                <th className="p-4 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-matrin-gray hover:text-matrin-primary transition-colors"
                  >
                    {selectedRowIds.size === paginatedData.length && paginatedData.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-matrin-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                {columns.map((col, idx) => {
                  const isSorted = sortField === col.accessorKey;
                  return (
                    <th
                      key={idx}
                      onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                      className={`p-4 select-none ${col.sortable ? 'cursor-pointer hover:text-matrin-text dark:hover:text-white' : ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-matrin-gray">
                            {isSorted ? (
                              sortDirection === 'asc' ? (
                                <ChevronUp className="w-3.5 h-3.5 text-matrin-primary" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-matrin-primary" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-matrin-border dark:divide-matrin-darkborder text-sm">
              {paginatedData.map((row, idx) => {
                const rowId = '' + row[primaryKey];
                const isSelected = selectedRowIds.has(rowId);
                return (
                  <tr
                    key={rowId || idx}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors duration-150 ${
                      isSelected
                        ? 'bg-matrin-primary/5 dark:bg-blue-950/20'
                        : 'hover:bg-matrin-bg/60 dark:hover:bg-slate-800/50'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    <td
                      className="p-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectRow(rowId);
                      }}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-matrin-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-matrin-gray hover:text-matrin-primary" />
                      )}
                    </td>
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="p-4 text-matrin-text dark:text-matrin-darktext font-medium">
                        {col.cell ? col.cell(row) : col.accessorKey ? row[col.accessorKey] : null}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-matrin-border dark:border-matrin-darkborder flex flex-wrap items-center justify-between gap-4 text-sm text-matrin-gray">
        <div>
          Showing{' '}
          <span className="font-semibold text-matrin-text dark:text-white">
            {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-matrin-text dark:text-white">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-matrin-text dark:text-white">
            {sortedData.length}
          </span>{' '}
          entries
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-lg px-2 py-1 text-xs focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-xs font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
