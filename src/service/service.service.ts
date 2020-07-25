import BaseService from '../service/base.service'

export default class ServiceService extends BaseService {
  getAll = async () => {
    return this.model.find()
  }

  getByName = async (name: string) => {
    return this.model.findOne({ name })
  }

  
}
