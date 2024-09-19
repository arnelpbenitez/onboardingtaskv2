using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
		public async Task<ActionResult<IEnumerable<Store>>> GetStores()
		{
			return await _context.Stores.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Store>> GetStore(int id)
		{
			var store = await _context.Stores.FindAsync(id);

			if (store == null)
			{
				return NotFound();
			}

			return store;
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutStore(int id, Store store)
		{
			if (id != store.Id)
			{
				return BadRequest();
			}

			_context.Entry(store).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!StoreExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}

		[HttpPost]
		public async Task<ActionResult<Store>> PostStore(Store store)
		{
			_context.Stores.Add(store);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetStore", new { id = store.Id }, store);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteStore(int id)
		{
			var store = await _context.Stores.FindAsync(id);
			if (store == null)
			{
				return NotFound();
			}

			_context.Stores.Remove(store);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool StoreExists(int id)
		{
			return _context.Stores.Any(e => e.Id == id);
		}
	}
}