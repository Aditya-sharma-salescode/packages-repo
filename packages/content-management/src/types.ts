export type popupType = "Alert" | "Error" | "Success";

export type filterType = { filters: Array<{ key: string; value: any }> };

export type metaDataBatchPayload = any;
export type configurationAttributeType = any;

export type uploadReportType = {
  attributes: {
    name: string;
    format: string;
    filter?: filterType;
  };
  lob?: any;
};

export type Banner = any;

