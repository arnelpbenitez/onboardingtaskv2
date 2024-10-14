using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnboardingTask.Server.Models;

[Table("Product")]
public partial class Product
{
	[Key]
	public int Id { get; set; }

	[Required(ErrorMessage = "Product Name is required")]
	[StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
	public required string Name { get; set; }

	[Column(TypeName = "decimal(18, 0)")]
	public decimal? Price { get; set; }

	[InverseProperty("Product")]
	public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
