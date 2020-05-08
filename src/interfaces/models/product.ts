export interface IProduct {
  id?: number;
  name: string;
  portion: string;
  sku: number;
  status: enStatus;
  category: enCategory;
  price: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export enum enStatus {
  available = 'available',
  unavailable = 'unavailable',
  hidden = 'hidden'
}

export enum enCategory {
  jewelery = 'jewelery',
  games = 'games',
  health = 'health'
}