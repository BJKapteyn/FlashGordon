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
using Microsoft.AspNetCore.Http;

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

        [HttpGet]
        public IActionResult GetAllFlashCards()
        {
            return Ok(JsonConvert.SerializeObject(FlashCardDAL.AllFlashCards));
        }

        //add flashcard to DB
        [HttpPost]
        public IActionResult AddFC([FromBody] FlashCard flashCard)
        {
            //Validate and move to flashCardDal--------------------------------------------------------------------------------------------TODO
            using (var FCContext = new FlashCardsContext())
            {
                try
                {
                    if (flashCard.Id < 0)
                    {
                        flashCard.Id = 0;
                    }
                    FCContext.Add(flashCard);
                    FCContext.SaveChanges();
                }
                catch
                {
                    return BadRequest();
                }

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

        [HttpDelete]
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

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult AddCategory([FromBody] string categoryName)
        {
            bool didAdd = FlashCardDAL.AddCategory(categoryName);

            //return unauthorized if category is already present
            if (didAdd)
            {
                return Ok();
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult DeleteCategory(string categoryName)
        {
            bool didDelete = FlashCardDAL.DeleteCategory(categoryName);

            if(didDelete)
            {
                return Ok();
            }
            else
            {
                return Unauthorized();
            }
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
