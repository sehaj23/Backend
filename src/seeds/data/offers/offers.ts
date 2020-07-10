import * as faker from 'faker'

const numberOfDocuments = 3
let max = 800, min = 100

const offers = []
for (let i = 0; i < numberOfDocuments; i += 1) {
  const offer = {
    unique_code: 'zat-' + faker.random.word(),
    updated_price: Math.floor(Math.random() * (max - min)) + min,
    start_date: new Date(),
    end_date: faker.date.between(new Date(), '2020-10-10'),
    max_usage: Math.floor(Math.random() * 10) + 1,
  }
  offers.push(offer)
}

export = offers
