export interface SerializedRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string | Record<string, any>;
}

export interface SerializedResponse {
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  parsedBody?: any;
}
