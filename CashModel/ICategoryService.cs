using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppCash.CashModel
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetCategories();
        //Task<bool> CreateProduct(Product product);  
        //Task<bool> EditProduct(int id, Product product);  

        //Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
        //Task<Product> SingleProduct(int id);  
        //Task<bool> DeleteProduct(int id);  
    }
}
