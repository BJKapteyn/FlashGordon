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
            FCards flashCard = new FCards(front, back, category);

            using (FCContext)
            {
                FCContext.Add(flashCard);
                FCContext.SaveChanges();
            }

            return Redirect("EditFlashCards");
        }

        public IActionResult EditFlashCards()
        {
            List<FCards> allFlashCards = FlashCardDB.GetAllCards();
            return View(allFlashCards);
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
