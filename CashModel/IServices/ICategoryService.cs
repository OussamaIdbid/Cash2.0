using System.Collections.Generic;
using System.Threading.Tasks;


namespace CashModel
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetCategories();
        Task<bool> CreateCategory(Category category);
        Task<bool> EditCategory(int id, Category category);  

        Task<Category> SingleCategory(int categoryId);
        Task<bool> DeleteCategory(int CategoryId);  
        Task<IEnumerable<Category>> GetPagedCategories(Pager pager);
    }
}