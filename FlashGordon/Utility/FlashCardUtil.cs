using FlashGordon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.Utility
{
    public class FlashCardCats
    {
        //used for keeping read only Categories 
        public static string Angular { get; } = "Angular";
        public static string JavaScript { get; } = "JavaScript";
        public static string Sql { get; } = "SQL";
        public static string CSharp { get; } = "CSharp";
        public static string HTML { get; } = "HTML";
        public static string CSS { get; } = "CSS";
        public static string UIUX { get; } = "UX/UI";

        //don't foreget to add the category here as well when adding a new one.
        public static string[] Categories = { Angular, JavaScript, Sql, CSharp, HTML, CSS, UIUX };
    }
}
