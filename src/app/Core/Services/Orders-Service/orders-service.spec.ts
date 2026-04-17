import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { Order } from '../../Constants/Api_Urls';
import { OrderInterface } from '../../Models/OrderModels/order-interface';
import { PaginatedResultInterface } from '../../Models/MenuItemModels/paginated-result-interface';
import { OrdersService } from './orders-service';
import { OrderDetailsInterface } from '../../Models/OrderModels/order-details-interface';

fdescribe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;


  const mockOrderDetails: OrderDetailsInterface = {
  id: 1,
  branchName: 'Main',
  userId: 'u1',
  userName: 'Ahmed',
  orderType: 'DineIn',
  status: 'Received',
  orderItems: [
    {
      menuItemId: 1,
      quantity: 2,
      unitPrice: 50,
    },
  ],
  kitchenTickets: [
    {
      id: 1,
      station: 'Grill',
      status: 'Preparing',
    },
  ],
  totalAmount: 100,
};


  const mockOrder: OrderInterface = {
    id: 1,
    branchName: 'Main',
    userId: 'u1',
    userName: 'Ahmed',
    orderType: 'DineIn',
    status: 'Received',
    orderItems: [
      {
        menuItemId: 1,
        quantity: 2,
        unitPrice: 50,
      },
    ],
    totalAmount: 100,
    tableNumber: '5',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
  };

  const mockPaginated: PaginatedResultInterface<OrderInterface> = {
    pageIndex: 1,
    pageSize: 10,
    count: 1,
    data: [mockOrder],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdersService],
    });

    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ---------------- CREATE ----------------
  it('should create order', () => {
    service.createOrder({} as any).subscribe((res) => {
      expect(res).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(Order.create);
    expect(req.request.method).toBe('POST');

    req.flush(mockOrder);
  });

  // ---------------- GET ALL ----------------
  it('should get all orders with cleaned params', () => {
    const params = {
      status: 'Received',
      page: 1,
      empty: '',
      nullValue: null,
    };

    service.getAllOrders(params).subscribe((res) => {
      expect(res).toEqual(mockPaginated);
    });

    const req = httpMock.expectOne((r) => {
      return r.url === Order.getAll && r.params.has('status') && !r.params.has('empty');
    });

    expect(req.request.method).toBe('GET');

    req.flush(mockPaginated);
  });

  // ---------------- GET BY ID ----------------
  it('should get order by id', () => {
    service.getOrderById(1).subscribe((res) => {
      expect(res).toEqual(mockOrderDetails);
    });

    const req = httpMock.expectOne(Order.getById(1));
    expect(req.request.method).toBe('GET');

    req.flush(mockOrderDetails);
  });

  // ---------------- MY ORDERS ----------------
  it('should get my orders', () => {
    service.getMyOrders().subscribe((res) => {
      expect(res).toEqual(mockPaginated);
    });

    const req = httpMock.expectOne(Order.myOrders);
    expect(req.request.method).toBe('GET');

    req.flush(mockPaginated);
  });

  // ---------------- UPDATE STATUS ----------------
  it('should update order status with JSON body', () => {
    const status = 'Preparing';

    service.updateOrderStatus(1, status).subscribe();

    const req = httpMock.expectOne(Order.updateStatus(1));

    expect(req.request.method).toBe('PUT');

    // 🔥 هنا بنأكد المشكلة بتاعت stringify
    expect(req.request.body).toBe(JSON.stringify(status));
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockOrder);
  });

  // ---------------- ADD ITEMS ----------------
  it('should add items to order', () => {
    const items = [
      { menuItemId: 1, quantity: 2, unitPrice: 50 },
    ];

    service.addItemsToOrder(1, items as any).subscribe();

    const req = httpMock.expectOne(Order.addItems(1));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(items);

    req.flush({});
  });

  // ---------------- REMOVE ITEM ----------------
  it('should remove item from order', () => {
    service.removeItemFromOrder(1, 2).subscribe();

    const req = httpMock.expectOne(Order.removeItem(1, 2));
    expect(req.request.method).toBe('DELETE');

    req.flush(mockOrder);
  });

  // ---------------- CANCEL ORDER ----------------
  it('should cancel order', () => {
    service.cancelOrder(1).subscribe();

    const req = httpMock.expectOne(Order.cancel(1));
    expect(req.request.method).toBe('PATCH');

    req.flush({});
  });

  // ---------------- WAITER MAPPING ----------------
  it('should map orders to waiter view', () => {
    service.getAllOrdersForWaiter({} as any).subscribe((res) => {
      expect(res.data[0].itemsCount).toBe(1);
      expect(res.data[0].tableNumber).toBe('5');
    });

    const req = httpMock.expectOne(Order.getAll);
    req.flush(mockPaginated);
  });

  // ---------------- CASHIER MAPPING ----------------
  it('should map orders to cashier view', () => {
    service.getAllOrdersForCashier({} as any).subscribe((res) => {
      expect(res.data[0].itemsCount).toBe(1);
      expect(res.data[0].paymentMethod).toBe('Cash');
    });

    const req = httpMock.expectOne(Order.getAll);
    req.flush(mockPaginated);
  });

  // ---------------- BUILD PARAMS EDGE CASE ----------------
  it('should remove null, undefined and empty params', () => {
    const params = {
      a: 1,
      b: null,
      c: undefined,
      d: '',
      e: 'valid',
    };

    const result = (service as any).buildParams(params);

    expect(result).toEqual({
      a: 1,
      e: 'valid',
    });
  });
});