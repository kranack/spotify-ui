interface DataSet {
  [attribute: string]: any
}

class UserStore {
  private static instance: UserStore
  private dataset: DataSet

  constructor() {
    this.dataset = {}
  }

  public set(key: string, value: any) {
    this.dataset[key] = value
  }

  public get(key: string) {
    return this.dataset[key]
  }

  public static getInstance() {
    if (!UserStore.instance) UserStore.instance = new UserStore()
    
    return UserStore.instance
  }
}

export default UserStore.getInstance