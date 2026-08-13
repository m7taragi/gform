import React from 'react';
import MatrixReportTable from './MatrixReportTable';

export default function MatrixReportDemo() {
    // Nested multi-level question hierarchy mock data:
    // Root 1: Sales Performance
    //   - Child 1.1: Online Channel
    //   - Child 1.2: Retail Stores
    // Root 2: Operational Metrics
    //   - Child 2.1: Order Fullfillment Speed
    const mockMetrics = [
        {
            questionId: "parent_1",
            shortHeading: "sales_perf",
            questionText: "Sales Performance Metrics",
            parentId: null,
            sortOrder: 1,
            vectors: { baseline: 0, periodProgress: 0, total: 0 }
        },
        {
            questionId: "child_1_1",
            shortHeading: "sales_online",
            questionText: "Online Channel Conversions",
            parentId: "parent_1",
            sortOrder: 1,
            vectors: { baseline: 1250, periodProgress: 320, total: 1570 }
        },
        {
            questionId: "child_1_2",
            shortHeading: "sales_retail",
            questionText: "Retail Store Conversions",
            parentId: "parent_1",
            sortOrder: 2,
            vectors: { baseline: 890, periodProgress: 210, total: 1100 }
        },
        {
            questionId: "parent_2",
            shortHeading: "ops_metrics",
            questionText: "Operational Fulfillment Metrics",
            parentId: null,
            sortOrder: 2,
            vectors: { baseline: 0, periodProgress: 0, total: 0 }
        },
        {
            questionId: "child_2_1",
            shortHeading: "fulfillment_avg_hr",
            questionText: "Avg Fulfillment Hours",
            parentId: "parent_2",
            sortOrder: 1,
            vectors: { baseline: 18, periodProgress: -2, total: 16 }
        }
    ];

    return (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '10px' }}>
            <MatrixReportTable
                metrics={mockMetrics}
                startDate="2026-08-01"
                endDate="2026-08-13"
                title="Merged Executive Report Grid — Multi-Level Spanning"
            />
        </div>
    );
}
