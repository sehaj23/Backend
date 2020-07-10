import * as faker from 'faker'
var mongoose = require('mongoose')

const numberOfDocuments = 10
const numberOfServices = 3
let i: number, j: number

const salons = []
for (i = 0; i < numberOfDocuments; i += 1) {
  const services = []
  for (j = 0; j < numberOfServices; j += 1) {
    const service = {
      name: faker.lorem.word(),
      price: faker.commerce.price(),
      duration: faker.random.number({ min: 15, max: 90 }),
      gender: faker.random.number() > faker.random.number() ? 'Male' : 'Female',
    }
    services.push(service)
  }

  const salon = {
    name: faker.company.companyName(),
    description: faker.company.catchPhraseDescriptor(),
    contact_number: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    services,
    employees: [],
    location: faker.address.city(),
    vendor_id: mongoose.Types.ObjectId(),
  }
  salons.push(salon)
}

export = salons
