using System.ComponentModel.DataAnnotations;

namespace Task2Protefolio.Models
{
    public class Skill
    {
        [Key]
        public int SkillId { get; set; }
        public string? Name { get; set; }
        public int? Level { get; set; }
    }
}
