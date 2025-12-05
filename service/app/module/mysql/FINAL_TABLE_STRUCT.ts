export type FieldType = {
  isNull?: boolean,
  isPrimary?: boolean,
  autoIncrement?: boolean,
  size?: number,
  comment?: string,
  default?: string,
  isUnsigned?: boolean,
  isUnique?: boolean,
  type: "CHAR"|"VARCHAR"|"INT"|"TEXT"|"TIMESTAMP"|"FLOAT"|"BIGINT"|"DOUBLE",
}

export const FINAL_TABLE_STRUCT = new Map<string , { [k: string]: FieldType }>()