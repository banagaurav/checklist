import express from 'express';

export interface UserRequest extends express.Request {
  user: any;
}

export enum Role {
  SYSADMIN = 'SYSADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  WAITER = 'WAITER',
  COOK = 'COOK',
  CUSTOMER = 'CUSTOMER',
  CLIENT = 'CLIENT',
}

export enum StaffRole {
  STAFF = 'STAFF',
  WAITER = 'WAITER',
  COOK = 'COOK',
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SYSADMIN]: 110,
  [Role.ADMIN]: 100,
  [Role.STAFF]: 90,
  [Role.WAITER]: 80,
  [Role.COOK]: 70,
  [Role.CUSTOMER]: 60,
  [Role.CLIENT]: 60,
};

export const roleIsAtLeast = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum OrderItemStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  ONLINE = 'ONLINE',
}

export enum PaymentSplitType {
  BY_ITEM = 'by_item',
  BY_AMOUNT = 'by_amount',
  BY_BILL = 'by_bill',
}

export enum ItemPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PaymentGateway {
  BANK_TRANSFER = 'BANK_TRANSFER',
  NEPAL_PAY = 'NEPAL_PAY',
  FONEPAY = 'FONEPAY',
  ESEWA = 'ESEWA',
  KHALTI = 'KHALTI',
  WALLET = 'WALLET',
  OTHER = 'OTHER',
}

export enum ExpenseCategory {
  STAFF_ADVANCE = 'STAFF_ADVANCE',
  REPAIR = 'REPAIR',
  EQUIPMENT = 'EQUIPMENT',
  FURNITURE = 'FURNITURE',
  UTILITIES = 'UTILITIES',
  MAINTENANCE = 'MAINTENANCE',
  MISC = 'MISC',
  INVENTORY_PURCHASE = 'INVENTORY_PURCHASE',
  SALARY = 'SALARY',
}

export enum ClientType {
  INTAKE = 'intake',
  CLIENT = 'client',
}

export enum MedicationType {
  REGULAR = 'regular',
  SHORT_TERM = 'short-term',
}

export interface UserPayload {
  fullName: string;
  username: string;
  userId: number;
  role: Role;
  organisationId: number;
  subId: number;
}

export enum KotStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY',
}

export enum PrinterType {
  KOT = 'KOT',
  BILL = 'BILL',
  BOTH = 'BOTH',
}

export enum PrintingMode {
  LOCAL = 'LOCAL',
  CLOUD = 'CLOUD',
}

export enum PrintJobStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export enum PrintJobReferenceType {
  KOT = 'KOT',
  ORDER = 'ORDER',
}

export enum PrinterConnectionType {
  USB = 'USB',
  NETWORK = 'NETWORK',
}

export enum PrimaryButtonAction {
  CONFIRM_ORDER = 'CONFIRM_ORDER',
  CONFIRM_AND_PRINT = 'CONFIRM_AND_PRINT',
}

export enum RemarksPosition {
  FOOTER = 'FOOTER',
  BELOW_DISH = 'BELOW_DISH',
}

export enum ServedSource {
  POS = 'POS',
  FULLSCREEN_POS = 'FULLSCREEN_POS',
  KDS = 'KDS',
  KITCHEN_PAGE = 'KITCHEN_PAGE',
}

export enum PrepaymentStatus {
  NONE = 'NONE',
  REQUESTED = 'REQUESTED',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum SessionType {
  TABLE = 'TABLE',
  COUNTER = 'COUNTER',
}

export enum BillingChannel {
  TABLE = 'TABLE',
  ORDER_BILLING = 'ORDER_BILLING',
  COUNTER = 'COUNTER',
}

export enum PaymentType {
  PAYMENT = 'PAYMENT',
  PRE_PAYMENT = 'PRE_PAYMENT',
  REFUND = 'REFUND',
}

export enum PrepaymentRequestStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  APPLIED = 'APPLIED',
  REFUNDED = 'REFUNDED',
}

