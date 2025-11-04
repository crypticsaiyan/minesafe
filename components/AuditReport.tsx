"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
    reports: any[];
    page: number;
}

const riskColors: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
};

export default function AuditReport({ reports, page }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((r) => (
                    <Card key={r.id} className="hover:shadow-lg transition-all">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                {r.period} Report
                            </CardTitle>
                            <p className="text-xs text-gray-500">
                                Generated {new Date(r.generatedAt).toLocaleDateString()}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div className="text-sm">
                                <strong>Total Accidents:</strong> {r.total_accidents}
                            </div>
                            <div className="text-sm">
                                <strong>Critical Violations:</strong> {r.critical_violations}
                            </div>
                            <div className="text-sm">
                                <strong>Compliance Score:</strong> {r.compliance_score}%
                            </div>

                            {/* ✅ Risk Level */}
                            <div className="mt-2">
                                <Badge className={riskColors[r.risk_level]}>
                                    {r.risk_level.toUpperCase()}
                                </Badge>
                            </div>

                            <Link
                                href={`/audit-reports/${r.id}`}
                                className="text-blue-600 text-sm underline mt-3 block"
                            >
                                View Full Report →
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ✅ Pagination */}
            <div className="flex justify-between pt-4">
                <Link href={`?page=${page - 1}`} className="text-sm opacity-70 disabled:pointer-events-none"
                    aria-disabled={page === 1}>
                    ← Previous
                </Link>
                <Link href={`?page=${page + 1}`} className="text-sm opacity-70">
                    Next →
                </Link>
            </div>
        </div>
    );
}
