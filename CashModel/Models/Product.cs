using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public string Color { get; set; }
        public TextColor textColor { get; set; }
        public static double TotalPrice = 0;


        public enum TextColor
        {
            white,
            black
        }
    }
}

