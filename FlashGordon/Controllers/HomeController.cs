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
using Newtonsoft.Json;

namespace FlashGordon.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private FlashCardsContext FCContext;
        FlashCardDB FlashCardDB;
        List<FCards> FlashCards;

        public HomeController(ILogger<HomeController> logger, FlashCardsContext fcc)
        {
            _logger = logger;
            FCContext = fcc;
            //initialize list of flash cards
            FlashCardDB = new FlashCardDB();
            FlashCards = FlashCardDB.AllFlashCards;
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
        public IActionResult UpdateFC([FromBody] FCards frontEndCard)
        {
            try
            {
                using (FCContext)
                {
                    FCards updateCard = FCContext.FCards.Single(x => x.Id == frontEndCard.Id);

                    updateCard = frontEndCard;
                    FCContext.SaveChanges();
           
                }
            }
            catch(InvalidOperationException)
            {
                return BadRequest();
            }
            return Ok();
        }

        public IActionResult EditFlashCards()
        {
            return View(FlashCards);
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
