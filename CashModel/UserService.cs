using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace CashModel
{
    public class UserService : IUserService
    {
        private readonly SqlConnectionConfiguration _configuration;
        public UserService(SqlConnectionConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> CreateUser(User user)
        {
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"insert into dbo.User (Username,Password) values (@Username,@Passsword)";
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    await conn.ExecuteAsync(query, new { user.Username, user.Password }, commandType: CommandType.Text);
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

        public async Task<IEnumerable<User>> GetUsers()
        {
            IEnumerable<User> users;
            using (var conn = new SqlConnection(_configuration.Value))
            {
                const string query = @"select * from cash.dbo.[User]";

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                try
                {
                    users = await conn.QueryAsync<User>(query);

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
            return users;
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
