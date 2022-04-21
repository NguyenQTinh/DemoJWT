import {BaseModel} from '../../../_metronic/shared/crud-table';

export interface JwtModel extends BaseModel {
    id: string;
    name?: string;
    maxDayStorage?: string;
    clServiceOptionDtos?: Array<CLServiceOption>;
    note?: string;
    active?: boolean;
}

export interface CLServiceOption {
    id?: string;
    resolution?: string;
    price?: number;
}
