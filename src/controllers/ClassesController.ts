import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';


interface ScheduleItem {
    week_day: number,
    from: string,
    to: string
}

export default class ClassesController {

    async index(request: Request, response: Response){
        const filters = request.query;

        if (!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: "Missing filters for class search"
            });
        }

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const timeInMinutes = convertHourToMinutes(filters.time as string);

        const classes = await db('classes')
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'users.id', '=', 'classes.user_id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);
    }

    async create(request: Request, response: Response) {
        
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const transaction = await db.transaction();
    
        try {
            const [insertedUserId] = await transaction('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });
        
            const [insertedClassId] = await transaction('classes').insert({
                subject,
                cost,
                user_id: insertedUserId
            });
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                    class_id: insertedClassId
                };
            });
        
            await transaction('class_schedule').insert(classSchedule);
        
            await transaction.commit();
        
            return response.status(201).send();
        }
        catch (err) {
            await transaction.rollback();
    
            return response.status(400).json({
                error: "Unexpected error while creating new DB instances."
            });
        }
    }

}