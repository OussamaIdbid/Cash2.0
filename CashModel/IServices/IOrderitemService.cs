using System.Collections.Generic;
using System.Threading.Tasks;


namespace CashModel
{
    public interface IOrderitemService
    {
        //Task<IEnumerable<Product>> GetProducts();
        Task<bool> CreateOrderitem(OrderItem orderItem);
        /*Task<bool> EditProduct(int id, Product product);

        Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
        Task<Product> SingleProduct(int id);
        Task<bool> DeleteProduct(int id);*/
    }
}