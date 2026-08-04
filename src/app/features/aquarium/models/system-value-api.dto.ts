export interface SystemValueApiDto {
  readonly id: string;
  readonly rootSystemValue: string;
  readonly systemValue: string;
  readonly description: string | null;
  readonly displayValue: string;
}
