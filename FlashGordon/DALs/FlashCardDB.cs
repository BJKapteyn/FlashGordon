using FlashGordon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.DALs
{
    public class FlashCardDB
    {
        private readonly FlashCardsContext FCContext;
        public List<FCards> AllFlashCards { get; private set; }
        public List<string> AllCategories { get; private set; }
        public FlashCardDB()
        {
            FCContext = new FlashCardsContext();
            AllFlashCards = GetAllCards();
            AllCategories = GetCategoriesSorted();
        }

        public void UpdateCategories()
        {
            AllCategories = GetCategoriesSorted();
        }

        private List<FCards> GetAllCards()
        {
            List<FCards> result = new List<FCards>();
            using (FCContext)
            {
                result = FCContext.FCards.ToList();
            }

            return result;
        }

        private List<string> GetCategories()
        {
            List<string> categories = new List<string>();
            using (FCContext)
            {
                categories = FCContext.Categories.Select(x => x.Name).ToList();
            }
            return categories;
        }
        
        private List<string> GetCategoriesSorted()
        {
            FlashCardsContext thisFCContext = new FlashCardsContext();
            List<string> categories = new List<string>();
            using (thisFCContext)
            {
                categories = thisFCContext.Categories.Select(x => x.Name).OrderBy(x => x).ToList();
            }
            return categories;
        }
    }
}
