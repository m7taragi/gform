import prisma from '@/lib/prisma';

class ReportRepository {
    async getSummaryData(formId, start, end) {
        // We use Prisma's typed raw query to perform the conditional aggregations
        // that were previously handled by Mongoose aggregation pipelines.
        const result = await prisma.$queryRaw`
            SELECT 
                q.id as "questionId",
                q."shortHeading",
                q."questionText",
                q."parentId",
                q."dataType",
                q."sortOrder",
                COALESCE(SUM(CASE WHEN s."targetDate" < ${start} THEN r.value ELSE 0 END), 0) as "baseline",
                COALESCE(SUM(CASE WHEN s."targetDate" >= ${start} AND s."targetDate" <= ${end} THEN r.value ELSE 0 END), 0) as "periodProgress",
                COALESCE(SUM(r.value), 0) as "total"
            FROM "Question" q
            LEFT JOIN "Response" r ON r."questionId" = q.id
            LEFT JOIN "Submission" s ON r."submissionId" = s.id AND s."formId" = ${formId} AND s."targetDate" <= ${end}
            WHERE q."formId" = ${formId}
            GROUP BY q.id
            ORDER BY q."sortOrder" ASC;
        `;
        
        // Map the flat SQL result back to the structured object expected by the frontend/service
        return result.map(row => ({
            questionId: row.questionId,
            shortHeading: row.shortHeading,
            questionText: row.questionText,
            parentId: row.parentId,
            dataType: row.dataType,
            sortOrder: row.sortOrder,
            vectors: {
                baseline: Number(row.baseline),
                periodProgress: Number(row.periodProgress),
                total: Number(row.total)
            }
        }));
    }

    async getQuestionsByFormId(formId) {
        return await prisma.question.findMany({
            where: { formId },
            orderBy: { sortOrder: 'asc' }
        });
    }
}

export default ReportRepository;

