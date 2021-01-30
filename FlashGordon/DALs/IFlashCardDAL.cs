using FlashGordon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.DALs
{
    public interface IFlashCardDAL
    {
        public void UpdateCategories();
        public bool DeleteFlashCard(int id);
        public void UpdateFlashCard(FlashCard frontEndCard);
        public bool AddCategory(string CategoryName);
        public bool DeleteCategory(string CategoryName);
        List<FlashCard> AllFlashCards { get; set; }
        List<string> AllCategories { get; set; }
    }
}
