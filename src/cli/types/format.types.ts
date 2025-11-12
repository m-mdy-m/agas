export interface FormatOptions {
  colors?: boolean;
  indent?: number;
  maxLength?: number;
  showHeaders?: boolean;
  showBody?: boolean;
  showTiming?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}
