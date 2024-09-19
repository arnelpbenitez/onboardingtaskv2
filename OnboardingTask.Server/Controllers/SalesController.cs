using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingTask.Server.Models;
using OnboardingTask.Server.Dtos;
using OnboardingTask.Server.Mappers;

namespace OnboardingTask.Server.Controllers
{
	[Route("[controller]")]
	[ApiController]

	public class SalesController : ControllerBase
	{
		private readonly OnboardingTaskContext _context;

		public SalesController(OnboardingTaskContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
		{
			return await _context.Sales
						.Include("Customer")
						.Include("Product")
						.Include("Store")
						.Select(s => SaleMapper.EntityToDto(s))
						.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Sale>> GetSale(int id)
		{
			var sale = await _context.Sales.FindAsync(id);

			if (sale == null)
			{
				return NotFound();
			}

			return sale;
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutSale(int id, Sale sale)
		{
			if (id != sale.Id)
			{
				return BadRequest();
			}

			_context.Entry(sale).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!SaleExists(id))
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
		public async Task<ActionResult<Sale>> PostSale(Sale sale)
		{
			_context.Sales.Add(sale);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetSale", new { id = sale.Id }, sale);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSale(int id)
		{
			var sale = await _context.Sales.FindAsync(id);
			if (sale == null)
			{
				return NotFound();
			}

			_context.Sales.Remove(sale);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool SaleExists(int id)
		{
			return _context.Sales.Any(e => e.Id == id);
		}
	}
}