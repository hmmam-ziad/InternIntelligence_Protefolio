using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task2Protefolio.Data;
using Task2Protefolio.Models;

namespace Task2Protefolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SkillsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllSkills")]
        public async Task<IActionResult> GetAllSkills()
        {
            var skills = await _context.Skill.ToListAsync();
            return Ok(skills);
        }

        [HttpPost("CreateSkill")]
        public async Task<IActionResult> CreateSkill([FromBody] Skill skill)
        {
            await _context.Skill.AddAsync(skill);
            await _context.SaveChangesAsync();
            return Ok(skill);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSkill(int id, [FromBody] Skill skill)
        {
            var skills = await _context.Skill.FindAsync(id);
            if (skills == null)
            {
                return NotFound();
            }
            skills.Name = skill.Name;
            skills.Level = skill.Level;
            await _context.SaveChangesAsync();
            return Ok(skills);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSkill(int id)
        {
            var skills = await _context.Skill.FindAsync(id);
            if (skills == null)
            {
                return NotFound();
            }
            _context.Skill.Remove(skills);
            await _context.SaveChangesAsync();
            return Ok(skills);
        }
    }
}
