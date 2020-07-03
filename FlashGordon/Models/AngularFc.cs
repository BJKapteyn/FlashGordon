using System;
using System.Collections.Generic;

namespace FlashGordon.Models
{
    public partial class AngularFC : IFlashCard
    {
        public AngularFC(string front, string back)
        {
            FrontSide = front;
            BackSide = back;
        }
        public int Id { get; set; }
        public string FrontSide { get; set; }
        public string BackSide { get; set; }
        public bool? IsUsed { get; set; } = true;
    }
}
