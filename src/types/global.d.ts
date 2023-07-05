export { };

declare global {
  interface DBConfig {
    db: string;
    host: string;
    password: string;
    username: string;
  };
  
  interface EnvConfigResponse {
    code: number;
    data: {
      Result: string;
    };
  };
  
  interface Dataset {
    meta?: MetaEntity[] | null;
    data?: DataEntity[] | null;
    rows: number;
    rows_before_limit_at_least: number;
    statistics: Statistics;
  }
  
  interface MetaEntity {
    name: string;
    type: string;
  }
  
  interface DataEntity {
    id: string;
    from_uid: number;
    to_uid: number;
    clubid: string;
    action_type: string;
    action_time: string;
    attach: string;
    leagueid: string;
    ds: number;
  }
  
  interface Statistics {
    elapsed: number;
    rows_read: number;
    bytes_read: number;
  }

  interface MysqlColumns {
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: string;
    Extra: string;
  }
}
