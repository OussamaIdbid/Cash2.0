using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CashModel
{
    public interface IOperationService
    {
        Task<IEnumerable<Operation>> GetOperations();
        Task<bool> CreateOperation(Operation operation);
        Task<IEnumerable<Operation>> GetPagedOperations(Pager pager);

        //Task<bool> EditProduct(int id, Product product);

        //Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
        //Task<Product> SingleProduct(int id);
        //Task<bool> DeleteProduct(int id);
    }
}