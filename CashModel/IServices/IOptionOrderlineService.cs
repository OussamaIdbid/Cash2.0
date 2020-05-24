using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CashModel
{
    public interface IOptionOrderlineService
    {
        Task<bool> CreateOptionOrderline(OptionOrderline optionOrderline);
    }
}
