using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
       
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (decimal)pageSize)
            };
            AddRange(items);
        }

        public MetaData MetaData { get; set; }

        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pagedNUmber, int pageSize)
        {
            var count = await query.CountAsync();
            var items = await query.Skip((pagedNUmber - 1) * pageSize).Take(pageSize).ToListAsync()
;           return new PagedList<T>(items, count, pagedNUmber, pageSize);
        }
    }
}
