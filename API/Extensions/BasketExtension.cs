using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace API.Extensions
{
    public static class BasketExtension
    {
        public static BasketDto ConvertBasketToBasketDto(this Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId= basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity,
                }).ToList()
            };
        }

        public static IQueryable<Basket> RetriveBasketWithItems(this IQueryable<Basket> basket, string buyerId)
        {
            return basket.Include(y => y.Items)
                            .ThenInclude(p => p.Product)
                            .Where(x => x.BuyerId == buyerId);
        }
    }
}
