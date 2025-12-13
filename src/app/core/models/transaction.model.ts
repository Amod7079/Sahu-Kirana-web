export enum TransactionType {
  CREDIT = 'CREDIT',
  PAYMENT = 'PAYMENT',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface Transaction {
  id?: string;
  customerId: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description?: string;
  date: Date;
  balanceAfter: number;
  createdAt?: Date;
  updatedAt?: Date;
}
