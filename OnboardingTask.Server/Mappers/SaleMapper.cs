
using OnboardingTask.Server.Models;
using OnboardingTask.Server.Dtos;

namespace OnboardingTask.Server.Mappers
{
	public static class SaleMapper
	{
		public static SaleDto EntityToDto(Sale sale)
		{
			var dto = new SaleDto
			{
				Id = sale.Id,
				DateSold = sale.DateSold,
				CustomerName = sale?.Customer?.Name,
				ProductName = sale?.Product?.Name,
				StoreName = sale?.Store?.Name,
				ProductId = sale?.ProductId,
				CustomerId = sale?.CustomerId,
				StoreId = sale?.StoreId
			};

			return dto;
		}
	}
}
