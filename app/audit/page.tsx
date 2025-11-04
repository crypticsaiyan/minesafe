import AuditReport from "@/components/AuditReport";
import { createClient } from '@supabase/supabase-js';

const PAGE_SIZE = 10;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLIC_KEY!
);

console.log(supabase);

async function getReports(page: number) {
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error } = await supabase
    .from('audit_reports')
    .select('*')
    .order('generated_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) throw new Error(error.message);

  return data;
}

export default async function AuditReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const reports = await getReports(page);

  return <AuditReport reports={reports} page={page} />;
}