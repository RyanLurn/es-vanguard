export interface SerializedRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface SerializedResponse {
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  parsedBody?: any;
}

export interface ReadResponse extends SerializedResponse {
  bodyUsed: boolean;
}
