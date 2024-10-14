using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnboardingTask.Server.Models;

[Table("Customer")]
public partial class Customer
{
	[Key]
	public int Id { get; set; }

	[Required(ErrorMessage = "Customer Name is required")]
	[StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters")]
	public required string Name { get; set; }

	[StringLength(100)]
	public string? Address { get; set; }

	[InverseProperty("Customer")]
	public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
