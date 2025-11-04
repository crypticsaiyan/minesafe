import { NextResponse } from "next/server";
import accidentData from "@/rag/accident_data.json";

export async function GET() {
  try {
    // Process and flatten the accident data from all years
    const processedData: any[] = [];

    // Helper to parse date and extract month/year
    const parseDate = (dateStr: string) => {
      // Format: DD/MM/YY or DD/MM/YYYY
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        let month = parseInt(parts[1]);
        let year = parseInt(parts[2]);
        
        // Convert 2-digit year to 4-digit
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        
        return { day, month, year };
      }
      return { day: 0, month: 0, year: 0 };
    };

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Process each year's data
    Object.entries(accidentData).forEach(([key, accidents]: [string, any]) => {
      if (Array.isArray(accidents)) {
        accidents.forEach((accident) => {
          const dateInfo = parseDate(accident.date || "");
          const monthName = dateInfo.month > 0 && dateInfo.month <= 12 
            ? monthNames[dateInfo.month - 1] 
            : "Unknown";

          processedData.push({
            ...accident,
            year: dateInfo.year > 0 ? dateInfo.year.toString() : "Unknown",
            month: monthName,
            state: accident.location?.state || "Unknown",
            district: accident.location?.district || "Unknown",
            cause_category: accident.cause_category || "Unknown",
            cause_specific: accident.cause_specific || "Unknown",
          });
        });
      }
    });

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error processing accident stats:", error);
    return NextResponse.json(
      { error: "Failed to process accident data" },
      { status: 500 }
    );
  }
}
