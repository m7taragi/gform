import React, { useMemo } from 'react';

/**
 * MatrixReportTable
 * Renders nested question hierarchies as a multi-level table with dynamic rowspan and colspan.
 * Under each leaf metric node, displays 3 computed vectors: Baseline, Period Progress, and Total.
 */
export default function MatrixReportTable({ metrics = [], startDate, endDate, title = "Dynamic Summary Matrix Report" }) {
    
    // 1. Build tree structure and calculate visual spanning parameters (colspan & rowspan)
    const { headerRows, leafNodes } = useMemo(() => {
        if (!metrics || metrics.length === 0) return { headerRows: [], leafNodes: [] };

        // Map metrics by questionId
        const nodeMap = new Map();
        metrics.forEach(m => {
            nodeMap.set(m.questionId.toString(), {
                ...m,
                id: m.questionId.toString(),
                parentId: m.parentId ? m.parentId.toString() : null,
                children: []
            });
        });

        // Assemble tree nodes
        const roots = [];
        nodeMap.forEach(node => {
            if (node.parentId && nodeMap.has(node.parentId)) {
                nodeMap.get(node.parentId).children.push(node);
            } else {
                roots.push(node);
            }
        });

        // Calculate max depth of tree
        const getDepth = (node) => {
            if (node.children.length === 0) return 1;
            return 1 + Math.max(...node.children.map(getDepth));
        };
        const maxDepth = roots.length > 0 ? Math.max(...roots.map(getDepth)) : 1;

        // Calculate leaf counts (each leaf question has 3 vector columns: Baseline, Period, Total)
        const computeSpans = (node) => {
            if (node.children.length === 0) {
                node.leafCount = 1;
                node.colSpan = 3; // 3 columns per leaf question
                return 1;
            }
            let count = 0;
            node.children.forEach(child => {
                count += computeSpans(child);
            });
            node.leafCount = count;
            node.colSpan = count * 3;
            return count;
        };
        roots.forEach(computeSpans);

        // Collect all leaf nodes for rendering data row values
        const leaves = [];
        const collectLeaves = (node) => {
            if (node.children.length === 0) {
                leaves.push(node);
            } else {
                node.children.forEach(collectLeaves);
            }
        };
        roots.forEach(collectLeaves);

        // Build header rows by level (depth)
        const levels = Array.from({ length: maxDepth }, () => []);

        const populateLevels = (node, depth) => {
            const isLeaf = node.children.length === 0;
            const rowSpan = isLeaf ? (maxDepth - depth) : 1;
            levels[depth].push({
                ...node,
                depth,
                rowSpan,
                colSpan: node.colSpan
            });
            node.children.forEach(child => populateLevels(child, depth + 1));
        };
        roots.forEach(root => populateLevels(root, 0));

        return { headerRows: levels, leafNodes: leaves };
    }, [metrics]);

    if (!metrics || metrics.length === 0) {
        return (
            <div style={styles.emptyContainer}>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No matrix reporting data available for the selected period.</p>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.headerBar}>
                <div>
                    <h3 style={styles.title}>{title}</h3>
                    <p style={styles.subtitle}>
                        Reporting Window: <span style={styles.dateHighlight}>{startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}</span> to <span style={styles.dateHighlight}>{endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}</span>
                    </p>
                </div>
                <div style={styles.badge}>
                    Option B Matrix Engine
                </div>
            </div>

            <div style={styles.tableScroll}>
                <table style={styles.table}>
                    <thead>
                        {/* Multi-level Question Hierarchy Header Rows */}
                        {headerRows.map((row, depthIdx) => (
                            <tr key={`header-row-${depthIdx}`}>
                                {depthIdx === 0 && (
                                    <th
                                        rowSpan={headerRows.length + 1}
                                        style={{ ...styles.th, ...styles.stickyColHeader }}
                                    >
                                        Metric Categories & Questions
                                    </th>
                                )}
                                {row.map(node => (
                                    <th
                                        key={node.id}
                                        colSpan={node.colSpan}
                                        rowSpan={node.rowSpan}
                                        style={{
                                            ...styles.th,
                                            ...styles.categoryHeader,
                                            background: depthIdx % 2 === 0 ? '#1e293b' : '#0f172a'
                                        }}
                                    >
                                        <div style={{ fontWeight: '600' }}>{node.questionText}</div>
                                        <span style={styles.shortCode}>{node.shortHeading}</span>
                                    </th>
                                ))}
                            </tr>
                        ))}

                        {/* Vector Sub-Header Row: Baseline | Period Progress | Total */}
                        <tr>
                            {leafNodes.map(leaf => (
                                <React.Fragment key={`sub-header-${leaf.id}`}>
                                    <th style={{ ...styles.th, ...styles.vectorBaseline }}>Baseline</th>
                                    <th style={{ ...styles.th, ...styles.vectorPeriod }}>Period Progress</th>
                                    <th style={{ ...styles.th, ...styles.vectorTotal }}>Total</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Primary Aggregated Data Vector Row */}
                        <tr style={styles.dataRow}>
                            <td style={{ ...styles.td, ...styles.stickyColData }}>
                                <div style={{ fontWeight: '600', color: '#f8fafc' }}>Aggregated Values</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Option B Point-in-Time Sums</div>
                            </td>
                            {leafNodes.map(leaf => {
                                const vectors = leaf.vectors || { baseline: 0, periodProgress: 0, total: 0 };
                                return (
                                    <React.Fragment key={`data-cell-${leaf.id}`}>
                                        <td style={{ ...styles.td, ...styles.cellBaseline }}>
                                            {vectors.baseline.toLocaleString()}
                                        </td>
                                        <td style={{ ...styles.td, ...styles.cellPeriod }}>
                                            +{vectors.periodProgress.toLocaleString()}
                                        </td>
                                        <td style={{ ...styles.td, ...styles.cellTotal }}>
                                            {vectors.total.toLocaleString()}
                                        </td>
                                    </React.Fragment>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '20px',
        color: '#f8fafc',
        marginTop: '20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
    },
    headerBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    title: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#ffffff',
        margin: 0
    },
    subtitle: {
        fontSize: '13px',
        color: '#94a3b8',
        marginTop: '4px'
    },
    dateHighlight: {
        color: '#818cf8',
        fontWeight: '600'
    },
    badge: {
        background: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid #4f46e5',
        color: '#818cf8',
        fontSize: '11px',
        fontWeight: '600',
        padding: '4px 10px',
        borderRadius: '20px'
    },
    tableScroll: {
        overflowX: 'auto',
        borderRadius: '10px',
        border: '1px solid #334155'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'center',
        fontSize: '13px'
    },
    th: {
        border: '1px solid #334155',
        padding: '10px 12px',
        color: '#e2e8f0'
    },
    stickyColHeader: {
        background: '#0f172a',
        textAlign: 'left',
        minWidth: '220px',
        fontWeight: 'bold',
        color: '#818cf8'
    },
    categoryHeader: {
        verticalAlign: 'middle'
    },
    shortCode: {
        fontSize: '10px',
        fontFamily: 'monospace',
        color: '#94a3b8',
        display: 'inline-block',
        marginTop: '2px'
    },
    vectorBaseline: {
        background: '#1e1b4b',
        color: '#a5b4fc',
        fontSize: '11px',
        minWidth: '100px'
    },
    vectorPeriod: {
        background: '#064e3b',
        color: '#6ee7b7',
        fontSize: '11px',
        minWidth: '110px'
    },
    vectorTotal: {
        background: '#312e81',
        color: '#c7d2fe',
        fontSize: '11px',
        fontWeight: 'bold',
        minWidth: '100px'
    },
    dataRow: {
        background: '#020617'
    },
    td: {
        border: '1px solid #334155',
        padding: '12px',
        fontFamily: 'monospace'
    },
    stickyColData: {
        textAlign: 'left',
        background: '#0f172a'
    },
    cellBaseline: {
        color: '#cbd5e1'
    },
    cellPeriod: {
        color: '#34d399',
        fontWeight: 'bold'
    },
    cellTotal: {
        color: '#818cf8',
        fontWeight: 'bold'
    },
    emptyContainer: {
        padding: '30px',
        textAlign: 'center',
        background: '#090d16',
        borderRadius: '12px',
        border: '1px solid #1e293b'
    }
};
