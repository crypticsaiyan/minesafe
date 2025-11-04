export default function AuditReport({ reports, page }: { reports: any[], page: number }) {
  if (reports.length === 0) {
    return <p>No audit reports found.</p>;
  }

  return (
    <div className="space-y-6">
      {reports.map(report => (
        <div
          key={report.id}
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-2">{report.title || 'Untitled Report'}</h2>
          <p className="text-sm text-gray-600 mb-2">Generated at: {new Date(report.generated_at).toLocaleString()}</p>

          {report.summary_points?.length > 0 && (
            <ul className="list-disc ml-6 text-gray-800">
              {report.summary_points.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          )}

          {report.pdf_url && (
            <a
              href={report.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 hover:underline"
            >
              View PDF
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
