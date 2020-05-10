using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class Table
    {
        public int Id { get; set; }
        public Status status { get; set; }


        public enum Status
        {
            Open,
            Taken
        }
    }
}
