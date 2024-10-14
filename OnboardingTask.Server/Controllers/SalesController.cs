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
using Microsoft.Data.SqlClient;

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
		public async Task<ActionResult<IEnumerable<SaleDto>>?> GetSales()
		{
			try
			{
				return await _context.Sales
							.Include("Customer")
							.Include("Product")
							.Include("Store")
							.Select(s => SaleMapper.EntityToDto(s))
							.ToListAsync();
			}
			catch (Exception)
			{
				return null;
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Sale>> GetSale(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid sale ID" });
			}

			try
			{
				var sale = await _context.Sales.FindAsync(id);

				if (sale == null)
				{
					return NotFound();
				}

				return sale;
			}
			catch (Exception)
			{
				return NotFound(new { Message = "Sale not found." });
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Sale>> PutSale(int id, Sale sale)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != sale.Id)
			{
				return BadRequest(new { Message = "Sale ID does not match." });
			}

			try
			{
				_context.Entry(sale).State = EntityState.Modified;
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateException e)
			{
				if (!SaleExists(id))
				{
					return NotFound(new { Message = "Sale not found." });
				}
				else
				{
					return BadRequest(new { Error = true, Message = (e.InnerException is SqlException es && es.Number == 547) ? "One or more data is required" : "An error occurred try again" });
				}
			}

			return sale;
		}

		[HttpPost]
		public async Task<ActionResult<Sale>> PostSale(Sale sale)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Sales.Add(sale);
				await _context.SaveChangesAsync();

				return CreatedAtAction("GetSale", new { id = sale.Id }, sale);
			}
			catch (DbUpdateException e)
			{
				return BadRequest(new { Error = true, Message = (e.InnerException is SqlException es && es.Number == 547) ? "One or more data is required" : "An error occurred try again" });
			}
			catch (Exception)
			{
				return BadRequest(new { Message = "An error occured please try again." });
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSale(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid Sale ID" });
			}

			try
			{
				var sale = await _context.Sales.FindAsync(id);
				if (sale == null)
				{
					return NotFound();
				}

				_context.Sales.Remove(sale);
				await _context.SaveChangesAsync();
				return Ok(new { Message = "Sale deleted successfully." });
			}
			catch (Exception)
			{
				return BadRequest(new { Message = "An error occurred try again" });
			}
		}

		private bool SaleExists(int id)
		{
			return _context.Sales.Any(e => e.Id == id);
		}
	}
}