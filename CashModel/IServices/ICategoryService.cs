using System.Collections.Generic;
using System.Threading.Tasks;


namespace CashModel
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetCategories();
        //Task<bool> CreateProduct(Product product);  
        //Task<bool> EditProduct(int id, Product product);  

        Task<Category> SingleCategory(int categoryId);
        //Task<Product> SingleProduct(int id);  
        //Task<bool> DeleteProduct(int id);  
    }
}