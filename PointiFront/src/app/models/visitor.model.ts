export interface Badge {
  id: number;
  name: string;
  color: string;
}

export interface Visitor {
  id?: number;
  nomPrenom: string;
  cin: number;
  organisation: string;
  createdAt?: string;
  updatedAt?: string;
  badge?: Badge;
}
