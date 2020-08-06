using FlashGordon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace FlashGordon.DALs
{
    public class FlashCardDB
    {
        private readonly FlashCardsContext FCContext;
        public List<FlashCard> AllFlashCards { get; private set; }
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

        public bool DeleteFlashCard(int id)
        {
            try
            {
                using (FCContext)
                {
                    FlashCard selectedCard = FCContext.FCards.Find(id);

                    FCContext.FCards.Remove(selectedCard);
                    FCContext.SaveChanges();

                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        private List<FlashCard> GetAllCards()
        {
            List<FlashCard> result = new List<FlashCard>();
            using (FCContext)
            {
                result = FCContext.FCards.OrderBy(x => x.Category).ToList();
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
                categories = thisFCContext.Categories.Select(x => x.Name).ToList();
            }
            return categories;
        }
    }
}
