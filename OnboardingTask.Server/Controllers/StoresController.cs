using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using OnboardingTask.Server.Models;

namespace OnboardingTask.Server.Controllers
{
	[Route("[controller]")]
	[ApiController]

	public class StoresController : ControllerBase
	{
		private readonly OnboardingTaskContext _context;

		public StoresController(OnboardingTaskContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Store>>?> GetStores()
		{
			try
			{
				return await _context.Stores.ToListAsync();
			}
			catch (Exception)
			{
				return null;
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Store>> GetStore(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid Store ID" });
			}

			try
			{
				var store = await _context.Stores.FindAsync(id);

				if (store == null)
				{
					return NotFound();
				}

				return store;
			}
			catch (Exception)
			{
				return NotFound(new { Message = "Store not found." });
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Store>> PutStore(int id, Store store)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != store.Id)
			{
				return BadRequest(new { Message = "Store ID does not match." });
			}

			try
			{
				_context.Entry(store).State = EntityState.Modified;
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!StoreExists(id))
				{
					return NotFound(new { Message = "Store not found." });
				}
				else
				{
					throw;
				}
			}

			return store;
		}

		[HttpPost]
		public async Task<ActionResult<Store>> PostStore(Store store)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Stores.Add(store);
				await _context.SaveChangesAsync();

				return CreatedAtAction("GetStore", new { id = store.Id }, store);
			}
			catch
			{
				return BadRequest(new { Message = "An error occured please try again." });
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteStore(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid store ID" });
			}

			var store = await _context.Stores.FindAsync(id);
			if (store == null)
			{
				return NotFound();
			}

			try
			{
				_context.Stores.Remove(store);
				await _context.SaveChangesAsync();

				return Ok(new { Message = "Store deleted successfully." });
			}
			catch (DbUpdateException e)
			{
				return BadRequest(new { Error = true, Message = (e.InnerException is SqlException es && es.Number == 547) ? "Cannot delete record in use." : "An error occurred try again" });
			}
			catch (Exception)
			{
				return BadRequest(new { Message = "An error occurred try again" });
			}
		}

		private bool StoreExists(int id)
		{
			return _context.Stores.Any(e => e.Id == id);
		}
	}
}