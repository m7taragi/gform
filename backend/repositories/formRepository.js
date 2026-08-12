const Form = require('../models/Form');

class FormRepository {
    // Persist a brand new custom structural form to the DB
    async createForm(formData) {
        const form = new Form(formData);
        return await form.save();
    }

    // Fetch all existing forms created by senior authorities
    async getAllForms() {
        return await Form.find().sort({ createdAt: -1 });
    }

    // Find one precise form configuration by its unique ID
    async getFormById(id) {
        return await Form.findById(id);
    }
}

module.exports = FormRepository;
