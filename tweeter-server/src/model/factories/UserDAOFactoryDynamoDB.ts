import { UserDAO } from "../dao/UserDAO";
import { UserDAOFactory } from "../service/UserService";

export class UserDAOFactoryDynamoDB implements UserDAOFactory {
    make(): UserDAO {
        return new UserDAODynamoDB();
    }
}