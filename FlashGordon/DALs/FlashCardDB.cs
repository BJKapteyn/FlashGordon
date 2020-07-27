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
        public List<FCards> AllFlashCards;
        public FlashCardDB()
        {
            FCContext = new FlashCardsContext();
            AllFlashCards = GetAllCards();
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

    }
}
