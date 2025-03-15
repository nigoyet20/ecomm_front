export interface NotificationI {
  id?: number;
  user_id?: number | null;
  email?: string;
  firstname?: string | null;
  lastname?: string | null;
  address?: string | null;
  c_name?: string | null;
  c_number?: string | null;
  exp_date?: string | null;
  cvc?: string | null;
  total?: string | null;
  status?: string | null;
  code?: string | null;
}