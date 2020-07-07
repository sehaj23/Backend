import * as faker from 'faker'
import encryptData from '../../../utils/password-hash'
import UserI from '../../../interfaces/user.interface'

const numberOfDocuments = 10

const users = []
for (let i = 0; i < numberOfDocuments; i += 1) {
  const user: UserI = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: encryptData(faker.lorem.word()),
  }
  users.push(user)
}

export = users
