import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    // Complete usando ORM
    return this.repository.createQueryBuilder("user")
      .leftJoinAndSelect("user.games", "games")
      .where("user.id = :id", { id: user_id }).getOne();
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("select * from users order by first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[]> {
    const formattedFirstName = first_name.toLowerCase();
    const formattedLastName = last_name.toLowerCase();
    return this.repository.query(
      `SELECT email, first_name, last_name FROM users where LOWER(first_name) = $1 and LOWER(last_name) = $2`,
      [formattedFirstName, formattedLastName]
    );
    // Complete usando raw query
  }
}
