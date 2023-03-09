using System;

namespace Kiltex.SistemaGestion.Services.Common
{
    public class RequestPaginatedData<T>
    {
        public T Filter { get; set; }
        public int Page { get; set; }

        int? _pageSize = default;
        public int PageSize { get => _pageSize ?? 1000; set => _pageSize = value; }
    }
    public class UserFilter
    {
        public string Query { get; set; }
        public long[] Rol { get; set; }
    }
    public class ProductFilter
    {
        public string? Product { get; set; }
        public long? Brand { get; set; }
        public long? Category { get; set; }
        public long? Status { get; set; }
        public List<long> Supplier { get; set; }
    }
    public class SpecificFilter
    {
        public string? Supplier { get; set; }
        public string? Category { get; set; }
        public int? StatusId { get; set; }
        public long? Number { get; set; }
        public string? Cuit { get; set; }
        public string? Date { get; set; }

    }
    public class PeriodFilter
    {
        public DateTime Date { get; set; }
    }

}
