using FlashGordon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.DALs
{
    public class FlashCardDB
    {
        private FlashCardsContext FlashCardContext;
        public FlashCardDB(FlashCardsContext fcc)
        {
            FlashCardContext = fcc;
        }
    }
}
