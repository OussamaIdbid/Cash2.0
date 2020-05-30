using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace CashModel
{
    public class OptionService : IOptionService
    {
        private readonly SqlConnectionConfiguration _configuration;
        public OptionService(SqlConnectionConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> CreateOption(Option option)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"insert into dbo.[Option] (Description,ProductId) values (@Description,@ProductId)";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { option.Description, option.ProductId }, commandType: CommandType.Text);
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
        public async Task<bool> DeleteOption(int Id)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"delete from dbo.[Option] where Id=@Id";
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
        public async Task<bool> EditOption(int Id, Option option)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"update dbo.[Option] set Description = @Description, ProductId = @ProductId where Id = @Id";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { option.Description, option.ProductId, Id }, commandType: CommandType.Text);
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

        public async Task<IEnumerable<Option>> GetOptions()
        {
            IEnumerable<Option> options;
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from cash.dbo.[Option]";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    options = await conn.QueryAsync<Option>(query);

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
            return options;
        }

       public async Task<Option> SingleOption(int Id)
        {
            Option option = new Option();

            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from dbo.[Option] where Id = @Id";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    option = await conn.QueryFirstOrDefaultAsync<Option>(query, new { Id }, commandType: CommandType.Text);
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
            return option;
        }
        public async Task<IEnumerable<Option>> OptionsByProduct(int Id)
        {
            IEnumerable<Option> options;

            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from dbo.[Option] where ProductId = @Id";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    options = await conn.QueryAsync<Option>(query, new {Id }, commandType: CommandType.Text);
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
            return options;
        }


    }
}
