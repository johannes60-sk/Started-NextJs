import { Request } from 'express';
import User from '../users/user.entity';
 
interface RequestWithUser extends Request {
  user: User;   //Ajoute une nouvelle propriété user à l'interface 
}
 
export default RequestWithUser;