import { IsNotEmpty, IsString } from "class-validator";

// C'est ici on defini les differentes colones que va contenir mon entite
export default class createPostDto {
    @IsString({each: true})  // verifie que la propriete paragraph est bien un tableau de chaines
    @IsNotEmpty()
    paragraphs: string[];

    content: string;
    
    @IsString()
    @IsNotEmpty()
    title: string;
}