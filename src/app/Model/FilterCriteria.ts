export class FilterCriteria<T> {
    pageNumber: number;
    pageSize: number;
    filter: T;
    lastId: number;
}