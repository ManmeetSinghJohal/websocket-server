export type Results = {
  services: Services;
  stats: Stats;
};

export type EndpointData = {
  endpoint: string;
  data: {
    status: string;
    region: string;
    roles: string[];
    results: Results;
    strict: boolean;
    server_issue: any;
  };
}

export type Services = {
  redis: boolean;
  database: boolean;
};

export type Stats = {
  servers_count: number;
  online: number;
  session: number;
  server: ServerStats;
};