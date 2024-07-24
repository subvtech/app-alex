type GenericObject = Record<string, any>;
export type YupSchema = {
  isYupSchema: boolean;
  validate(value: any, options: GenericObject): Promise<any>;
};
