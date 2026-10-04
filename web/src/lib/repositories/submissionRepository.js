import prisma from '@/lib/prisma';

class SubmissionRepository {
    async getQuestionById(questionId) {
        return await prisma.question.findUnique({ where: { id: questionId } });
    }

    async getHistoricalSum(formId, targetDate, questionId) {
        const result = await prisma.response.aggregate({
            _sum: {
                value: true
            },
            where: {
                questionId,
                submission: {
                    formId,
                    targetDate: { lt: targetDate }
                }
            }
        });
        return result._sum.value || 0;
    }

    async findSubmission(formId, targetDate) {
        return await prisma.submission.findUnique({
            where: {
                formId_targetDate: {
                    formId,
                    targetDate
                }
            }
        });
    }

    async createSubmission(data) {
        return await prisma.submission.create({ data });
    }

    async bulkUpsertResponses(bulkOps) {
        const operations = bulkOps.map(op => {
            return prisma.response.upsert({
                where: {
                    submissionId_questionId: {
                        submissionId: op.submissionId,
                        questionId: op.questionId
                    }
                },
                update: {
                    value: op.value,
                    userEnteredCumulative: op.userEnteredCumulative
                },
                create: {
                    submissionId: op.submissionId,
                    questionId: op.questionId,
                    value: op.value,
                    userEnteredCumulative: op.userEnteredCumulative
                }
            });
        });
        
        return await prisma.$transaction(operations);
    }

    async findResponsesBySubmissionId(submissionId) {
        return await prisma.response.findMany({
            where: { submissionId },
            include: { question: true }
        });
    }
}

export default SubmissionRepository;

