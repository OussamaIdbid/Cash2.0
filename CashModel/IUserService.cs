using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CashModel
{
        public interface IUserService
        {
            Task<IEnumerable<User>> GetUsers();
            Task<bool> CreateUser(User user);
            //Task<bool> EditProduct(int id, Product product);

            //Task<IEnumerable<Product>> GetProductsByCategory(int categoryId);
            //Task<Product> SingleProduct(int id);
            //Task<bool> DeleteProduct(int id);
        }
    }

