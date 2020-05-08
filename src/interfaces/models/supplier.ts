export interface ISupplier {
  id?: number;
  personName: string;
  cnpj: number;
  supplierName: string;
  email: string;
  cell1: number;
  cell2?: number;
  logoUrl?: string;
  productName: string[];

  // Adress
  zipCode: number;
  address: string;
  number: string;
  neighborhood: string;
  complement?: string;
  city: string;
  state: string;

  // Dates
  createdDate?: Date;
  updatedDate?: Date;
}

