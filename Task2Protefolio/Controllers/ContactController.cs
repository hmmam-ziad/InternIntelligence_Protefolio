using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task2Protefolio.Data;
using Task2Protefolio.Models;

namespace Task2Protefolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllContacts")]
        public async Task<IActionResult> GetAllContacts()
        {
            var contacts = await _context.Contact.ToListAsync();
            return Ok(contacts);
        }

        [HttpPost("CreateContact")]
        public async Task<IActionResult> CreateContact([FromBody] Contact contact)
        {
            await _context.Contact.AddAsync(contact);
            await _context.SaveChangesAsync();
            return Ok(contact);
        }
    }
}
