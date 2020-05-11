using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    class OrderItem
    {
        public int Id { get; set; }
        public double TotalPrice { get; set; }
        public int Quantity { get; set; }
        public Product Product { get; set; }
    }
}
