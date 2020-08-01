using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.Models
{
    public class Categories
    {
        [Key]
        public string Name { get; set; }
    }
}
