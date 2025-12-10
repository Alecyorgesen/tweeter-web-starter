import { StatusDto, UserDto } from "tweeter-shared";

export class UserBatch {
  users: UserDto[];
  status: StatusDto;
  constructor(users: UserDto[], status: StatusDto) {
    this.users = users;
    this.status = status;
  }
}
