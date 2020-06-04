using System.Collections.Generic;
using System.Threading.Tasks;


namespace CashModel
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProducts();
        Task<bool> CreateProduct(Product product);
        Task<bool> EditProduct(int id, Product product);
        Task<IEnumerable<Product>> GetPagedProducts(Pager pager);

        Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
        Task<IEnumerable<Product>> SearchProductsByCategory(int categoryId, string Name);


        Task<Product> SingleProduct(int id);
        Task<bool> DeleteProduct(int id);
    }
}