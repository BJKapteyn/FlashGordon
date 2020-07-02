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

        public bool AddFlashCard(IFlashCard flashCard)
        {
            string fcType = flashCard.GetType().ToString().Split('.')[1];

            using(FCContext)
            {
                switch(fcType)
                {
                    case "AngularFC":
                        FCContext.AngularFc.Add((AngularFC)flashCard);
                        break;
                    case "CsharpFC":
                        FCContext.CsharpFc.Add((CsharpFC)flashCard);
                        break;
                    case "JavascriptFC":
                        FCContext.JavascriptFc.Add((JavascriptFC)flashCard);
                        break;
                    case "SqlFC":
                        FCContext.SqlFc.Add((SqlFC)flashCard);
                        break;
                    default:
                        return false;
                }
            }
            return true;
        }
    }
}
