using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.Models
{
    interface IFlashCard
    {
        public int Id { get; set; }
        public string FrontSide { get; set; }
        public string BackSide { get; set; }
        public bool? IsUsed { get; set; }
    }
}
