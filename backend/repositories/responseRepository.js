const Response = require('../models/Response');

class ResponseRepository {
    async createResponse(data) {
        const newResponse = new Response(data);
        return await newResponse.save();
    }

    async getResponsesByFormId(formId) {
        return await Response.find({ formId }).sort({ createdAt: -1 });
    }
}

module.exports = ResponseRepository;
