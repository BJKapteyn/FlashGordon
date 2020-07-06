using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlashGordon.Utility
{
    public class FlashCardCats
    {
        //used for keeping read only Categories 
        public static string AngularCat { get; } = "Angular";
        public static string JavaScriptCat { get; } = "JavaScript";
        public static string SqlCat { get; } = "SQL";
        public static string CSharpCat { get; } = "CSharp";
        public static string HTMLCat { get; } = "HTML";
        public static string CSSCat { get; } = "CSS";

        //don't foreget to add the category here as well when adding a new one.
        public static string[] Categories = { AngularCat, JavaScriptCat, SqlCat, CSharpCat, HTMLCat };

    }
}
