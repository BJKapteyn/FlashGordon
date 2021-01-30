using FlashGordon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace FlashGordon.DALs
{
    public class FlashCardDAL : IFlashCardDAL
    {
        private FlashCardsContext FCContext;
        public List<FlashCard> AllFlashCards { get; set; }
        public List<string> AllCategories { get; set; }
        public FlashCardDAL(FlashCardsContext fcc)
        {
            FCContext = fcc;
            AllFlashCards = GetAllCards();
            AllCategories = GetCategoriesSorted();
        }

        //
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
                }

                return true;
        }
            catch
            {
                return false;
            }
        }

        public void UpdateFlashCard(FlashCard frontEndCard)
        {
            FlashCard updateCard = FCContext.FCards.Single(x => x.Id == frontEndCard.Id);

            updateCard.Category = frontEndCard.Category;
            updateCard.Front = frontEndCard.Front;
            updateCard.Back = frontEndCard.Back;

            FCContext.SaveChanges();
        }

        private List<FlashCard> GetAllCards()
        {
            List<FlashCard> allFlashCards = new List<FlashCard>();


            allFlashCards = FCContext.FCards.OrderBy(x => x.Category).ToList();

            return allFlashCards;
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
            List<string> categories = new List<string>();

            using (var context = new FlashCardsContext())
            {
                categories = context.Categories.Select(x => x.Name).ToList();
            }

            return categories;
        }

        public bool AddCategory(string CategoryName)
        {
            using (var context = new FlashCardsContext())
            {
                if(AllCategories.Contains(CategoryName) == false)
                {
                    Category cat = new Category()
                    {
                        Name = CategoryName
                    };


                    context.Categories.Add(cat);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public void DeleteCategory(string CategoryName)
        {
            using (var context = new FlashCardsContext())
            {
                Category cat = new Category()
                {
                    Name = CategoryName
                };
                context.Categories.Remove(cat);
            }
        }
    }
}
