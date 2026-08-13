class SubmissionService {
    constructor(submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async createOrUpdateSubmission(data) {
        const { formId, targetDate, submittedBy, answers } = data;
        const parsedDate = new Date(targetDate);
        const mismatches = [];
        const processedAnswers = [];

        for (const ans of answers) {
            const { questionId, todayValue = 0, userEnteredCumulative = null } = ans;
            if (!questionId) continue;

            const question = await this.submissionRepository.getQuestionById(questionId);
            if (!question) {
                const err = new Error(`Question with ID ${questionId} not found.`);
                err.status = 404;
                throw err;
            }

            if (question.isCumulativeTracked && userEnteredCumulative !== null) {
                const priorSum = await this.submissionRepository.getHistoricalSum(formId, parsedDate, questionId);
                const expectedCumulative = priorSum + Number(todayValue);

                if (expectedCumulative !== Number(userEnteredCumulative)) {
                    mismatches.push({
                        questionId,
                        shortHeading: question.shortHeading,
                        todayValue: Number(todayValue),
                        userEnteredCumulative: Number(userEnteredCumulative),
                        calculatedPriorSum: priorSum,
                        expectedCumulative
                    });
                }
            }

            processedAnswers.push({
                questionId,
                value: Number(todayValue),
                userEnteredCumulative: userEnteredCumulative !== null ? Number(userEnteredCumulative) : null
            });
        }

        if (mismatches.length > 0) {
            const err = new Error("Cumulative validation failed. User-entered cumulative total does not match computed historical sum + today's value.");
            err.status = 422;
            err.mismatches = mismatches;
            throw err;
        }

        let submission = await this.submissionRepository.findSubmission(formId, parsedDate);

        if (!submission) {
            submission = await this.submissionRepository.createSubmission({
                formId,
                targetDate: parsedDate,
                submittedBy: submittedBy || null
            });
        }

        const bulkOps = processedAnswers.map(ans => ({
            updateOne: {
                filter: { submissionId: submission._id, questionId: ans.questionId },
                update: {
                    $set: {
                        value: ans.value,
                        userEnteredCumulative: ans.userEnteredCumulative
                    }
                },
                upsert: true
            }
        }));

        if (bulkOps.length > 0) {
            await this.submissionRepository.bulkUpsertResponses(bulkOps);
        }

        const savedResponses = await this.submissionRepository.findResponsesBySubmissionId(submission._id);

        return {
            submission,
            responses: savedResponses
        };
    }

    async getSubmissionByDate(formId, targetDate) {
        const parsedDate = new Date(targetDate);
        const submission = await this.submissionRepository.findSubmission(formId, parsedDate);
        if (!submission) {
            const err = new Error("No submission found for the specified date.");
            err.status = 404;
            throw err;
        }

        const responses = await this.submissionRepository.findResponsesBySubmissionId(submission._id);

        return {
            submission,
            responses
        };
    }
}

module.exports = SubmissionService;
