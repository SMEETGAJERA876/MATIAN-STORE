import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';
import { parseCSV } from '../../utils/csv';

export const CSVImportModal: React.FC = () => {
  const { isCSVImportModalOpen, setCSVImportModalOpen, importProducts, addToast } = useAdminStore();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvText(text);
        try {
          const parsed = parseCSV(text);
          setParsedRows(parsed);
          setError('');
        } catch (err) {
          setError('Failed to parse CSV file. Ensure valid headers and comma separation.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) {
      addToast('error', 'No rows available to import');
      return;
    }
    importProducts(parsedRows);
    setCSVImportModalOpen(false);
    setParsedRows([]);
    setCsvText('');
  };

  return (
    <Modal
      isOpen={isCSVImportModalOpen}
      onClose={() => setCSVImportModalOpen(false)}
      title="Import CSV Data to MATRIN Engine"
      maxWidth="xl"
    >
      <div className="space-y-6">
        <p className="text-sm text-matrin-gray dark:text-slate-400">
          Upload a CSV file containing product catalog items, orders, or inventory adjustments.
          The parser will automatically map fields like <code className="text-matrin-primary">name</code>, <code className="text-matrin-primary">sku</code>, <code className="text-matrin-primary">price</code>, and <code className="text-matrin-primary">stock</code>.
        </p>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-matrin-border dark:border-matrin-darkborder rounded-3xl p-8 text-center hover:border-matrin-primary transition-colors bg-matrin-bg/30 dark:bg-slate-900/30">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-file-input"
          />
          <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-matrin-primary/10 text-matrin-primary dark:text-blue-400 flex items-center justify-center mb-3">
              <Upload className="w-7 h-7" />
            </div>
            <span className="font-bold text-sm text-matrin-text dark:text-white">
              Click to upload or drag & drop CSV
            </span>
            <span className="text-xs text-matrin-gray mt-1">
              Supports CSV files up to 10MB
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-matrin-text dark:text-white">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Validated {parsedRows.length} Rows Ready
              </span>
              <span>Showing preview of first 3 rows</span>
            </div>

            <div className="max-h-40 overflow-auto border border-matrin-border dark:border-matrin-darkborder rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-matrin-bg dark:bg-slate-900 border-b border-matrin-border">
                  <tr>
                    {Object.keys(parsedRows[0]).map((header, idx) => (
                      <th key={idx} className="p-2 font-bold uppercase">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-matrin-border">
                  {parsedRows.slice(0, 3).map((row, rIdx) => (
                    <tr key={rIdx}>
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-2 truncate max-w-[120px]">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-matrin-border dark:border-matrin-darkborder">
          <Button variant="outline" onClick={() => setCSVImportModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={parsedRows.length === 0}
            onClick={handleConfirmImport}
            icon={<FileText className="w-4 h-4" />}
          >
            Import {parsedRows.length} Records
          </Button>
        </div>
      </div>
    </Modal>
  );
};
