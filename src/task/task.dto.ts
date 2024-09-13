import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export enum TaskStatus {
    TODO = "todo",
    DONE = "done",
    IN_PROGRESS = "in_progress"
}

export class TaskDTO {
    @IsUUID()
    @IsOptional()
    id: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title: string;

    @IsString()
    @MinLength(3)
    @MaxLength(500)
    description: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status: TaskStatus;

    @IsDateString()
    expirationDate: Date;

}

export interface FindAllParameters {
    title: string;
    status: string
}
