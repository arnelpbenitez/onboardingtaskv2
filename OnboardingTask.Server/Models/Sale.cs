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

    public int? ProductId { get; set; }

    public int? CustomerId { get; set; }

    public int? StoreId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateSold { get; set; }

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
