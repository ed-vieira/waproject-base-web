import {ISupplier} from 'interfaces/models/supplier';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class SupplierService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<ISupplier>> {
    return this.apiService.get('/company', params);
  }

  public save(model: Partial<ISupplier>): Observable<ISupplier> {
    return this.apiService.post('/company', model);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/company/${id}`);
  }
}

const companyService = new SupplierService(apiService);
export default companyService;
