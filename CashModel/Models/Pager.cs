using System;
using System.Collections.Generic;
using System.Text;

namespace CashModel
{
    public class Pager
    {
        public int Page { get; set; }
        public int PageSize { get; set; }

        public int Offset { get; set; }
        public int Next { get; set; }

        public Pager(int page, int pageSize)
        {
            Page = page < 1 ? 1 : page;
            PageSize = pageSize < 1 ? pageSize : pageSize;

            Next = pageSize;
            Offset = (Page - 1) * Next;
        }

    }
}
