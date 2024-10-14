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

	public class CustomersController : ControllerBase
	{
		private readonly OnboardingTaskContext _context;

		public CustomersController(OnboardingTaskContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Customer>>?> GetCustomers()
		{
			try
			{
				return await _context.Customers.ToListAsync();
			}
			catch (Exception)
			{
				return null;
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Customer>?> GetCustomer(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid customer ID" });
			}

			try
			{
				var customer = await _context.Customers.FindAsync(id);

				if (customer == null)
				{
					return NotFound(new { Message = "Customer not found." });
				}

				return customer;
			}
			catch (Exception)
			{
				return NotFound(new { Message = "Customer not found." });
			}
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Customer>> PutCustomer(int id, Customer customer)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != customer.Id)
			{
				return BadRequest(new { Message = "Customer ID does not match." });
			}

			try
			{
				_context.Entry(customer).State = EntityState.Modified;
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!CustomerExists(id))
				{
					return NotFound(new { Message = "Customer not found." });
				}
				else
				{
					throw;
				}
			}

			return customer;
		}

		[HttpPost]
		public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				_context.Customers.Add(customer);
				await _context.SaveChangesAsync();

				return CreatedAtAction("GetCustomer", new { id = customer.Id }, customer);
			}
			catch
			{
				return BadRequest(new { Message = "An error occured please try again." });
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteCustomer(int id)
		{
			if (id == 0)
			{
				return BadRequest(new { Message = "Invalid customer ID" });
			}

			try
			{
				var customer = await _context.Customers.FindAsync(id);
				if (customer == null)
				{
					return NotFound(new { Message = "Customer not found." });
				}

				_context.Customers.Remove(customer);
				await _context.SaveChangesAsync();

				return Ok(new { Message = "Customer deleted successfully." });
			}

			catch (DbUpdateException e)
			{
				return BadRequest(new { Error = true, Message = (e.InnerException is SqlException es && es.Number == 547) ? "Cannot delete record in use." : "An error occurred try again" });
			}
			catch (Exception)
			{
				return BadRequest(new { Message = "An error occurred try again." });
			}
		}

		private bool CustomerExists(int id)
		{
			return _context.Customers.Any(e => e.Id == id);
		}
	}
}