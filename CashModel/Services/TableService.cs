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
                const string query = @"insert into dbo.[Table] (Status,TableNumber) values (@Status,@TableNumber)";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { table.status, table.TableNumber }, commandType: CommandType.Text);
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
        public async Task<IEnumerable<Table>> GetPagedTables(Pager pager)
        {
            IEnumerable<Table> tables;
            using (var conn = new SqlConnection(_configuration.Value))
            {

                var query = @"SELECT * FROM cash.dbo.[Table] order by Id OFFSET @Offset ROWS FETCH NEXT @Next ROWS ONLY";


                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    tables = await conn.QueryAsync<Table>(query, pager);

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
        public async Task<bool> DeleteTable(int Id)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"delete from dbo.[Table] where Id=@Id";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { Id }, commandType: CommandType.Text);
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
        public async Task<bool> EditTable(int Id, Table table)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"update dbo.[Table] set TableNumber = @TableNumber where Id = @Id";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { table.TableNumber, Id }, commandType: CommandType.Text);
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

        public async Task<Table> SingleTable(int Id)
        {
            Table table = new Table();

            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from dbo.[Table] where Id =@Id";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    table = await conn.QueryFirstOrDefaultAsync<Table>(query, new { Id }, commandType: CommandType.Text);
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
            return table;
        }



    }
}
