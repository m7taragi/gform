class FormService {
    constructor(formRepository, responseRepository) {
        this.formRepository = formRepository;
        this.responseRepository = responseRepository;
    }

    async createForm(data) {
        if (!data.title || !data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error("Title and at least one question are required.");
        }
        return await this.formRepository.createForm(data);
    }

    async getAllForms() {
        return await this.formRepository.getAllForms();
    }

    async getFormById(id) {
        const form = await this.formRepository.getFormById(id);
        if (!form) {
            throw new Error("Requested Form structure not found.");
        }
        return form;
    }

    async submitResponse(data) {
        if (!data.formId || !data.answers || !Array.isArray(data.answers)) {
            throw new Error("Invalid submission data package.");
        }
        return await this.responseRepository.createResponse(data);
    }

    async getFormResponses(formId) {
        return await this.responseRepository.getResponsesByFormId(formId);
    }
}

module.exports = FormService;
