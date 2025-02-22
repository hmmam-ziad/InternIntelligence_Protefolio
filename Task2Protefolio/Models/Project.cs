using System.ComponentModel.DataAnnotations;

namespace Task2Protefolio.Models
{
    public class Projects
    {
        [Key]
        public int ProjectId { get; set; }
        public string? ProjectTitle { get; set; }
        public string? ProjectDescription { get; set; }
        public string? ProjectLink { get; set; }
        public string? ImageUrl { get; set; }

    }
}
