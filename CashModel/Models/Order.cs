using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class Order
    {
        public int Id { get; set; }
        public List<OrderItem> orderitems { get; set; }
     
    }
}
