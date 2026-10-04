import prisma from '@/lib/prisma';

class ResponseRepository {
    async createResponse(data) {
        return await prisma.response.create({ data });
    }

    async getResponsesByFormId(formId) {
        return await prisma.response.findMany({
            where: {
                submission: {
                    formId: formId
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export default ResponseRepository;

