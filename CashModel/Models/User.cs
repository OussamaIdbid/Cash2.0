using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public static bool IsloggedIn { get; set; } = false;
        public static string CurrentUsername { get; set; } = "";
        public static int CurrentId { get; set; } = 0;

    }
}
