using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CashModel
{
    public interface ITableService
    {
        Task<IEnumerable<Table>> GetTables();
        Task<bool> CreateTable(Table table);
        Task<bool> EditTable(int id, Table table);

        //Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
        //Task<Product> SingleProduct(int id);
        //Task<bool> DeleteProduct(int id);
    }
}
