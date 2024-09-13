import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDTO, TaskStatus } from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/Task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>
    ) {}

    async create(task: TaskDTO): Promise<TaskDTO> {
        task.status = TaskStatus.TODO
        

        const savedTask = await this.taskRepository.save(task);

        return savedTask
    }

    async findById(id: string): Promise<TaskDTO> {
        const foundTask = await this.taskRepository.findOne({ where: {id} })
        if (!foundTask) {
            throw new NotFoundException(`The task with id: ${id} was not found`)
        }
        return this.mapToDTO(foundTask);
    }

    async update(task: TaskDTO): Promise<TaskDTO> {
        const taskDB = this.taskRepository.findOne({
            where: {
                id: task.id
            }
        })

        if (!taskDB) throw new NotFoundException("This task was not found");

        const updatedTask = await this.taskRepository.update({
            id: task.id
        }, {
            title: task.title,
            description: task.description,
            expirationDate: task.expirationDate,
            status: task.status
        })

        return task;
    }

    async remove(id: string) {
        const deletedTask = await this.taskRepository.delete(id)

        if (!deletedTask) throw new NotFoundException("This task was not found");
    }

    async findAll(queryParams: FindAllParameters) {

        if (!queryParams.title && !queryParams.status) {
            const allTasks = await this.taskRepository.find();
            return allTasks.map(task => this.mapToDTO(task));
        }

        const foundTasks = await this.taskRepository.createQueryBuilder("task")
        .where("task.title LIKE :title", { title: `%${queryParams.title}%` })
        .orWhere("task.status = :status", { status: queryParams.status })
        .getMany()

        return foundTasks.map(task => this.mapToDTO(task));
    }

    private mapToDTO (taskEntity: TaskEntity): TaskDTO{
        return{
            description: taskEntity.description,
            expirationDate: taskEntity.expirationDate,
            id: taskEntity.id,
            status: TaskStatus[taskEntity.status],
            title: taskEntity.title
        }
    }
}
