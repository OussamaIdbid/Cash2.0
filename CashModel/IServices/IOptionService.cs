using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;


namespace CashModel
{
    public interface IOptionService
    {
        Task<IEnumerable<Option>> GetOptions();
        Task<bool> CreateOption(Option option);
        Task<bool> EditOption(int Id, Option option);
        Task<bool> DeleteOption(int Id);
        Task<IEnumerable<Option>> OptionsByProduct(int Id);
        Task<Option> SingleOption(int Id);

    }
}
