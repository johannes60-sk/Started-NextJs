import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams{

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    startId?: number;
    
    @IsOptional()
    @Type(() => Number)  // indique que la propriété sur laquelle il est appliqué devrait être transformée en un nombre lors de la désérialisation (par exemple, lors de la conversion d'un objet JSON en instance de classe).
    @IsNumber()
    @Min(0)
    offset?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;
}