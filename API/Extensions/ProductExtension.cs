using API.Entities;

namespace API.Extensions
{
    public static class ProductExtension
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p=>p.Name);
            query = orderBy switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };
            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string search)
        {
            if (string.IsNullOrWhiteSpace(search)) return query;
            var searchWord = search.Trim().ToLower();
            var data = query.Where(p=>p.Name.ToLower().Contains(searchWord));
            return data;
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            List<string> brandList = new List<string>();
            List<string> typeList = new();
            if (!string.IsNullOrEmpty(brands)) brandList.AddRange(brands.ToLower().Split(','));
            if (!string.IsNullOrEmpty(types)) typeList.AddRange(types.ToLower().Split(','));
            query = query.Where(p =>brandList.Count==0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p=>typeList.Count==0 || typeList.Contains(p.Type.ToLower()));
            return query;
        }
    }
}
