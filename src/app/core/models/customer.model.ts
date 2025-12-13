export interface Customer {
  id?: string;
  name: string;
  phone: string;
  address?: string;
  email?: string;
  totalCredit: number;
  totalPaid: number;
  balance: number;
  lastTransactionDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}
