export interface inputI {
  name: string;
  type: string;
  text: string;
  backWhite?: boolean;
  required?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string;
  modal?: string;
  disabled?: boolean;
  rows?: number;
  columns?: number;
  backgroundColor?: string;
}