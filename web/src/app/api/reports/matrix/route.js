import { NextResponse } from 'next/server';
import ReportService from '@/lib/services/reportService';
import ReportRepository from '@/lib/repositories/reportRepository';

const reportService = new ReportService(new ReportRepository());

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const formId = searchParams.get('formId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        
        if (!formId || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
        }
        
        const report = await reportService.generateMatrixReport(formId, startDate, endDate);
        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
