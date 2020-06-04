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

        Task<Table> SingleTable(int tableId);
        Task<bool> DeleteTable(int TableId);
        Task<IEnumerable<Table>> GetPagedTables(Pager pager);
    }
}