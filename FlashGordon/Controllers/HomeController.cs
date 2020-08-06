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
        FlashCardDB FlashCardDAL;

        public HomeController(ILogger<HomeController> logger, FlashCardsContext fcc)
        {
            _logger = logger;
            FCContext = fcc;
            //initialize list of flash cards
            FlashCardDAL = new FlashCardDB();
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
            FlashCard flashCard = new FlashCard(front, back, category);

            using (FCContext)
            {
                FCContext.Add(flashCard);
                FCContext.SaveChanges();
            }
            //Take me back, back where I belong
            return Redirect("EditFlashCards");
        }

        [HttpPost]
        public IActionResult UpdateFC([FromBody] FlashCard frontEndCard)
        {
            try
            {
                //move this to DAL
                using (FCContext)
                {
                    FlashCard updateCard = FCContext.FCards.Single(x => x.Id == frontEndCard.Id);

                    updateCard.Category = frontEndCard.Category;
                    updateCard.Front = frontEndCard.Front;
                    updateCard.Back = frontEndCard.Back;

                    FCContext.SaveChanges();
           
                }
            }
            catch(InvalidOperationException)
            {
                return BadRequest();
            }
            return Ok();
        }



        public IActionResult DeleteFC(int id)
        {
            if (FlashCardDAL.DeleteFlashCard(id))
            {
                return Ok();
            }

            return NotFound();
        }

        public IActionResult GetCategories()
        {
            FlashCardDAL.UpdateCategories();
            List<string> categories = FlashCardDAL.AllCategories;

            return Ok(JsonConvert.SerializeObject(categories));
            
        }

        public IActionResult EditFlashCards()
        {
            return View(FlashCardDAL);
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
