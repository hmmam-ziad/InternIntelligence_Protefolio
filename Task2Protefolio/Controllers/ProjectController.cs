using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Task2Protefolio.Data;
using Task2Protefolio.Models;

namespace Task2Protefolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _context.Project.ToListAsync();
            return Ok(projects);
        }

        [HttpPost("CreateProject")]
        public async Task<IActionResult> CreateProject([FromForm] Projects project, [FromForm] IFormFile Image)
        {
            var imagePath = Path.Combine("wwwroot/images", Image.FileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await Image.CopyToAsync(stream);
            }

            Projects projects = new Projects
            {
                ProjectTitle = project.ProjectTitle,
                ProjectDescription = project.ProjectDescription,
                ProjectLink = project.ProjectLink,
                ImageUrl = $"{Image.FileName}"
            };
            await _context.Project.AddAsync(projects);
            await _context.SaveChangesAsync();
            return Ok(project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromForm] Projects project, [FromForm] IFormFile Image)
        {
            var projects = await _context.Project.FindAsync(id);
            if (projects == null)
            {
                return NotFound();
            }
            var imagePath = Path.Combine("wwwroot/images", Image.FileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await Image.CopyToAsync(stream);
            }
            projects.ProjectTitle = project.ProjectTitle;
            projects.ProjectDescription = project.ProjectDescription;
            projects.ProjectLink = project.ProjectLink;
            projects.ImageUrl = $"/images/{Image.FileName}";
            _context.Project.Update(projects);
            await _context.SaveChangesAsync();
            return Ok(projects);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var projects = await _context.Project.FindAsync(id);
            if (projects == null)
            {
                return NotFound();
            }
            _context.Project.Remove(projects);
            await _context.SaveChangesAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var projects = await _context.Project.FindAsync(id);
            if (projects == null)
            {
                return NotFound();
            }
            return Ok(projects);
        }
    }
}
