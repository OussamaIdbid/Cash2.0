using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace CashModel
{
    public class OperationService : IOperationService
    {
        private readonly SqlConnectionConfiguration _configuration;
        public OperationService(SqlConnectionConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> CreateOperation(Operation operation)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"insert into dbo.[Operation] (Description,UserId) values (@Description,@UserId)";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { operation.Description, operation.UserId }, commandType: CommandType.Text);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }
            }
            return true;
        }
        /*public async Task<bool> DeleteCategory(int CategoryId)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"delete from dbo.Category where CategoryId=@CategoryId";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { CategoryId }, commandType: CommandType.Text);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }
            }
            return true;
        }*/
        /*public async Task<bool> EditCategory(int CategoryId, Category category)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"update dbo.Category set Name = @Name where CategoryId=@CategoryId";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { category.CategoryName, CategoryId }, commandType: CommandType.Text);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }
            }
            return true;
        }*/

        public async Task<IEnumerable<Operation>> GetOperations()
        {
            IEnumerable<Operation> operations;
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from cash.dbo.[Operation]";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    operations = await conn.QueryAsync<Operation>(query);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }

            }
            return operations;
        }
        public async Task<IEnumerable<Operation>> GetPagedOperations(Pager pager)
        {
            IEnumerable<Operation> operations;
            using (var conn = new SqlConnection(_configuration.Value))
            {

                var query = @"SELECT * FROM cash.dbo.[Operation] order by Id OFFSET @Offset ROWS FETCH NEXT @Next ROWS ONLY";


                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    operations = await conn.QueryAsync<Operation>(query, pager);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }

            }
            return operations;

        }

        /*public async Task<Category> SingleCategory(int CategoryId)
        {
            Category category = new Category();

            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from dbo.Category where CategoryId =@CategoryId";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    category = await conn.QueryFirstOrDefaultAsync<Category>(query, new { CategoryId }, commandType: CommandType.Text);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }
            }
            return category;
        }*/
    }
}
