import { Router } from 'express';
import { Types } from 'mongoose';
export function createResourceRouter(resourceModel, sort = { createdAt: -1 }) {
    const router = Router();
    router
        .route('/')
        .get(async (_request, response) => {
        const records = await resourceModel.find().sort(sort).lean();
        response.json(records);
    })
        .post(async (request, response) => {
        const record = await resourceModel.create(request.body);
        response.status(201).json(record);
    });
    router
        .route('/:id')
        .all((request, response, next) => {
        if (!Types.ObjectId.isValid(request.params.id)) {
            response.status(400).json({ error: 'Invalid resource id' });
            return;
        }
        next();
    })
        .get(async (request, response) => {
        const record = await resourceModel.findById(request.params.id).lean();
        if (!record) {
            response.status(404).json({ error: 'Resource not found' });
            return;
        }
        response.json(record);
    })
        .patch(async (request, response) => {
        const record = await resourceModel.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true,
        }).lean();
        if (!record) {
            response.status(404).json({ error: 'Resource not found' });
            return;
        }
        response.json(record);
    })
        .delete(async (request, response) => {
        const record = await resourceModel.findByIdAndDelete(request.params.id);
        if (!record) {
            response.status(404).json({ error: 'Resource not found' });
            return;
        }
        response.status(204).end();
    });
    return router;
}
