import * as faker from 'faker'
import AdminSI from '../../../interfaces/admin.interface'
import encryptData from '../../../utils/password-hash'

const numberOfDocuments = 10
let i: number

const admins = []
for (i = 0; i < numberOfDocuments; i += 1) {
  const admin: AdminSI = {
    username: faker.name.firstName(),
    password: encryptData('abc@123'),
    role: faker.random.number() > faker.random.number() ? 'admin' : 'sub-admin',
  }
  admins.push(admin)
}

export = admins
