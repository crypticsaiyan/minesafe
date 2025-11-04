'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AuditReport from '@/components/AuditReport';

const PAGE_SIZE = 10;

export default function AuditReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      const offset = (page - 1) * PAGE_SIZE;

      const { data, error } = await supabase
        .from('audit_reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        console.error('Error fetching reports:', error.message);
      } else {
        setReports(data ?? []);
      }
      setLoading(false);
    }

    loadReports();
  }, [page]);

  if (loading) return <p className="text-center py-10">Loading reports...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Audit Reports</h1>

      <AuditReport reports={reports} page={page} />

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
