using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnboardingTask.Server.Models;

[Table("Store")]
public partial class Store
{
	[Key]
	public int Id { get; set; }

	[Required(ErrorMessage = "Store Name is required")]
	[StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
	public required string Name { get; set; }

	[StringLength(100)]
	public string? Address { get; set; }

	[InverseProperty("Store")]
	public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
