using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class Table
    {
        public static bool isTaken { get; set; }
        public static int CurrentTable { get; set; }
        public int Id { get; set; }
        public Status status { get; set; }
        public List<OrderItem> orderItems { get; set; }
        public bool active { get; set; }



        public enum Status
        {
            Open,
            Taken
        }
    }
}
