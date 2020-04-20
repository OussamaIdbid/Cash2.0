using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class User
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public static bool IsloggedIn { get; set; } = false;

    }
}
