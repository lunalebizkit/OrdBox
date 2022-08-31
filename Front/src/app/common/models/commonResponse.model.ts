export interface CommonResponse<T> {
    data: [T];
    success: boolean;
    exception: any;
}

export interface DtoPagination<T>
{
    data: [T];
    totalCount: number;
    pageSize: number;
}