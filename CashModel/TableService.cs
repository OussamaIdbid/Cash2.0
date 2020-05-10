using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;


namespace CashModel
{
    public class TableService : ITableService
    {
        private readonly SqlConnectionConfiguration _configuration;
        public TableService(SqlConnectionConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> CreateTable (Table table)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"insert into dbo.[Table] (Status) values (@Status)";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { table.status }, commandType: CommandType.Text);
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
        public async Task<bool> EditTable(int Id, Table table)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"update dbo.[Table] set Status = @Status where Id=@Id";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { table.status, Id }, commandType: CommandType.Text);
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

        public async Task<IEnumerable<Table>> GetTables()
        {
            IEnumerable<Table> tables;
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from cash.dbo.[Table]";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    tables = await conn.QueryAsync<Table>(query);

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
            return tables;
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
