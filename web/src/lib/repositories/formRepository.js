import prisma from '@/lib/prisma';

class FormRepository {
    async createForm(formData) {
        return await prisma.form.create({ data: formData });
    }

    async getAllForms() {
        return await prisma.form.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async getFormById(id) {
        return await prisma.form.findUnique({
            where: { id }
        });
    }
}

export default FormRepository;

