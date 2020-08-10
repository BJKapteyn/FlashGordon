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
        IFlashCardDAL FlashCardDAL;

        public HomeController(ILogger<HomeController> logger, IFlashCardDAL flashCardDAL)
        {
            _logger = logger;
            //initialize list of flash cards
            FlashCardDAL = flashCardDAL;
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
            using(var FCContext = new FlashCardsContext())
            {
                FlashCard flashCard = new FlashCard(front, back, category);
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
                FlashCardDAL.UpdateFlashCard(frontEndCard);
            }
            catch (InvalidOperationException)
            {
                return BadRequest();
            }
            return Ok();
        }


        [HttpPost]
        public IActionResult DeleteFC([FromBody] FlashCardIdBind flashCardId)
        {
            if (FlashCardDAL.DeleteFlashCard(flashCardId.Id))
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
