using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FlashGordon.Models
{
    public partial class FlashCard
    {
        public FlashCard(string front, string back, string category)
        {
            Front = front;
            Back = back;
            Category = category;
            IsUsed = false;
        }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Front { get; set; }
        public string Back { get; set; }
        public bool IsUsed { get; set; } = false;
        public string Category { get; set; }

    }
}
