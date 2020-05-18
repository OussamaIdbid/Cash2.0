using System.Collections.Generic;
using System.Threading.Tasks;


namespace CashModel
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetOrders();
        Task<bool> CreateOrder(Order order);
        /*Task<bool> EditProduct(int id, Product product);

        Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
        Task<Product> SingleProduct(int id);
        Task<bool> DeleteProduct(int id);*/
    }
}