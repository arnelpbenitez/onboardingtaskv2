using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnboardingTask.Server.Models;

public partial class Sale
{
	[Key]
	public int Id { get; set; }

	[Required(ErrorMessage = "Product ID  is required")]
	public required int ProductId { get; set; }

	[Required(ErrorMessage = "Customer ID  is required")]
	public required int CustomerId { get; set; }

	[Required(ErrorMessage = "Store ID  is required")]
	public required int StoreId { get; set; }

	[Required(ErrorMessage = "Date Sold  is required")]
	[Column(TypeName = "datetime")]
	public required DateTime DateSold { get; set; }

	[ForeignKey("CustomerId")]
	[InverseProperty("Sales")]
	public virtual Customer? Customer { get; set; }

	[ForeignKey("ProductId")]
	[InverseProperty("Sales")]
	public virtual Product? Product { get; set; }

	[ForeignKey("StoreId")]
	[InverseProperty("Sales")]
	public virtual Store? Store { get; set; }
}
