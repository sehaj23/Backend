import * as faker from 'faker'
import { VendorI } from '../../../interfaces/vendor.interface'
import encryptData from '../../../utils/password-hash'

const numberOfDocuments = 10
let i: number

const vendors = []
for (i = 0; i < numberOfDocuments; i += 1) {
  const vendor: VendorI = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: encryptData('abc@123'),
    contact_number: faker.phone.phoneNumber(),
  }
  vendors.push(vendor)
}

export = vendors
