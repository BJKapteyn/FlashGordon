using System;
using System.Collections.Generic;

namespace FlashGordon.Models
{
    public partial class SqlFC : IFlashCard
    {
        public int Id { get; set; }
        public string FrontSide { get; set; }
        public string BackSide { get; set; }
        public bool? IsUsed { get; set; }
    }
}
