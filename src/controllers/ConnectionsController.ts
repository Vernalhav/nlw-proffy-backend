import { Request, Response } from 'express';

import db from '../database/connection';

export default class ClassesController {

    async index(request: Request, response: Response){
        const totalConnections = await db('connections').count('* as total');
        const {total} = totalConnections[0];
        return response.json({ total });
    }
    
    async create(request: Request, response: Response) {
        const {user_id} = request.body;
        
        const transaction = await db.transaction();
        
        await transaction('connections').insert({
            user_id: Number(user_id)
        });

        await transaction.commit();
        return response.status(201);
    }
}