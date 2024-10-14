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

	public class ProductsController : ControllerBase
	{
		private readonly OnboardingTaskContext _context;

		public ProductsController(OnboardingTaskContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Product>>?> GetProducts()
		{
			try
			{
				return await _context.Products.ToListAsync();
			}
			catch (Exception)
			{
				return null;
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Product>> GetProduct(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid product ID" });
			}

			try
			{
				var product = await _context.Products.FindAsync(id);

				if (product == null)
				{
					return NotFound(new { Message = "Product not found." });
				}

				return product;
			}
			catch (Exception)
			{
				return NotFound(new { Message = "Product not found." });
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Product>> PutProduct(int id, Product product)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != product.Id)
			{
				return BadRequest(new { Message = "Product ID does not match." });
			}

			try
			{
				_context.Entry(product).State = EntityState.Modified;
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!ProductExists(id))
				{
					return NotFound(new { Message = "Product not found." });
				}
				else
				{
					throw;
				}
			}

			return product;
		}

		[HttpPost]
		public async Task<ActionResult<Product>> PostProduct(Product product)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Products.Add(product);
				await _context.SaveChangesAsync();

				return CreatedAtAction("GetProduct", new { id = product.Id }, product);
			}
			catch (Exception)
			{
				return BadRequest(new { Message = "An error occured please try again." });
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteProduct(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid product ID." });
			}

			try
			{
				var product = await _context.Products.FindAsync(id);
				if (product == null)
				{
					return NotFound(new { Message = "Product not found." });
				}

				_context.Products.Remove(product);
				await _context.SaveChangesAsync();

				return Ok(new { Message = "Product deleted successfully." });
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

		private bool ProductExists(int id)
		{
			return _context.Products.Any(e => e.Id == id);
		}
	}
}