using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class Order
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public double TotalPrice { get; set; }
        public PaymentMethod paymentMethod { get; set; }
        public List<OrderItem> orderitems { get; set; }


        public enum PaymentMethod {Cash, Pin }
    }
}
