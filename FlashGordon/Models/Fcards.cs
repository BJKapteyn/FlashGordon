using System;
using System.Collections.Generic;

namespace FlashGordon.Models
{
    public partial class FCards
    {
        public FCards(string front, string back, string category)
        {
            Front = front;
            Back = back;
            Category = category;
            IsUsed = false;
        }
        public int Id { get; set; }
        public string Front { get; set; }
        public string Back { get; set; }
        public bool IsUsed { get; set; } = false;
        public string Category { get; set; }

    }
}
