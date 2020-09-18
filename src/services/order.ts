import IOrder from 'interfaces/models/order';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class OrderService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IOrder>> {
    return this.apiService.get('/orders', params);
  }

  public save(model: Partial<IOrder>): Observable<IOrder> {
    return this.apiService.post('/orders', model);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/orders/${id}`);
  }
}

const userService = new OrderService(apiService);
export default userService;
