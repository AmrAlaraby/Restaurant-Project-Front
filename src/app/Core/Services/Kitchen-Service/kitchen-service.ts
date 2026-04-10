import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KitchenTicketQueryParams } from '../../Models/KitchenModels/kitchen-ticket-query-params';
import { KitchenBoardDto } from '../../Models/KitchenModels/kitchen-board-dto';
import { Kitchen } from '../../Constants/Api_Urls';
import { KitchenTicketDetailsDto } from '../../Models/KitchenModels/kitchen-ticket-details-dto';
import { ActivePendingStationsDTO } from '../../Models/KitchenModels/active-pending-stations-dto';
import { UpdateTicketStatusRequestDto } from '../../Models/KitchenModels/update-ticket-status-request-dto';
import { KitchenTicketStatusDto } from '../../Models/KitchenModels/kitchen-ticket-status-dto';


@Injectable({ providedIn: 'root' })
export class KitchenService {
  constructor(private http: HttpClient) {}

  getBoard(params: KitchenTicketQueryParams): Observable<KitchenBoardDto> {
    let httpParams = new HttpParams();
    if (params.branchId != null) httpParams = httpParams.set('branchId', params.branchId);
    if (params.orderId != null) httpParams = httpParams.set('OrderId', params.orderId);
    if (params.station) httpParams = httpParams.set('Station', params.station);
    if (params.status != null) httpParams = httpParams.set('Status', params.status);
    return this.http.get<KitchenBoardDto>(Kitchen.board, { params: httpParams });
  }

  getTicket(id: number): Observable<KitchenTicketDetailsDto> {
    return this.http.get<KitchenTicketDetailsDto>(Kitchen.ticket(id));
  }

  getActiveStations(branchId: number): Observable<ActivePendingStationsDTO[]> {
    const params = new HttpParams().set('branchId', branchId);
    return this.http.get<ActivePendingStationsDTO[]>(Kitchen.activeStations, { params });
  }

  updateTicketStatus(ticketId: number, dto: UpdateTicketStatusRequestDto): Observable<KitchenTicketStatusDto> {
    return this.http.put<KitchenTicketStatusDto>(Kitchen.updateStatus(ticketId), dto);
  }
}
