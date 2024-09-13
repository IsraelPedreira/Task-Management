import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDTO } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) { };

    @Post()
    async create(@Body() task: TaskDTO): Promise<TaskDTO> {
        return await this.taskService.create(task);
    }

    @Get("/:id")
    async findById(@Param("id") id: string): Promise<TaskDTO> {
        return await this.taskService.findById(id)
    }

    @Get()
    async findAll(@Query() queryParams: FindAllParameters): Promise<TaskDTO[]> {
        return await this.taskService.findAll(queryParams)
    }

    @Put()
    async update(@Body() task: TaskDTO): Promise<TaskDTO> {
        return await this.taskService.update(task)
    }

    @Delete("/:id")
    async remove(@Param("id") id: string){
        return await this.taskService.remove(id)
    }
}
