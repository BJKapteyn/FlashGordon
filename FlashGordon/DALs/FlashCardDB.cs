using FlashGordon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.DALs
{
    public class FlashCardDB
    {
        private FlashCardsContext FCContext;
        public FlashCardDB(FlashCardsContext fcc)
        {
            FCContext = fcc;
        }

        public List<FCards> GetAllCards()
        {
            List<FCards> result = new List<FCards>();
            using (FCContext)
            {
                result = FCContext.FCards.ToList(); ;
            }

            return result;
        }

    }
}
