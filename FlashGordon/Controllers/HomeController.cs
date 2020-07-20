using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using FlashGordon.Models;
using FlashGordon.Utility;
using FlashGordon.DALs;

namespace FlashGordon.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private FlashCardsContext FCContext;

        public HomeController(ILogger<HomeController> logger, FlashCardsContext fcc)
        {
            _logger = logger;
            FCContext = fcc;
        }

        public IActionResult Index()
        {
            return View();
        }
        //add flashcard to DB
        [HttpPost]
        public IActionResult AddFC(string front, string back, string category)
        {
            //Validate!--------------------------------------------------------------------------------------------TODO
            FCards flashCard = new FCards(front, back, category);

            using (FCContext)
            {
                FCContext.Add(flashCard);
                FCContext.SaveChanges();
            }
            //Take me back, back where I belong
            return Redirect("EditFlashCards");
        }

        [HttpPost]
        public IActionResult UpdateFC(string front, string back, string category, string id)
        {
            int cardId = -1;
            bool didParse = int.TryParse(id, out cardId);
            using (FCContext)
            {
                if (didParse)
                {
                    FCards updateCard = FCContext.FCards.First(card => card.Id == cardId);
                }

            }
            return Ok();
        }

        public IActionResult EditFlashCards()
        {
            FlashCardDB flashCardDB = new FlashCardDB(FCContext);
            
            return View(flashCardDB.AllFlashCards);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
