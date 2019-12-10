using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public static int AmountOfCategories { get; set; }
        public IList<Product> ListOfProducts { get; set; }
        

    }
}
