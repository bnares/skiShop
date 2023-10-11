using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name ="GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrivrBasket(GetBuyerId());

            if (basket == null) return BadRequest();
            return basket.ConvertBasketToBasketDto();
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            //get basket
            //or create basket
            var basket = await RetrivrBasket(GetBuyerId());
            if (basket is null) basket = CreateBasket();
            //get product
            var product = await _context.Products.FindAsync(productId);
            if(product is null) return NotFound();
            //add item
            basket.AddItem(product, quantity);
            //save changes
            var result = await _context.SaveChangesAsync()>0;
            if(result) return CreatedAtRoute("GetBasket", basket.ConvertBasketToBasketDto());
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //get basket
            var basket =await  RetrivrBasket(GetBuyerId());
            if (basket is null) return NotFound();
            // remove item or reduce quantity
            basket.RemoveItem(productId, quantity);
            //save changes
            var result = await _context.SaveChangesAsync()>0;
            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title="Cant remove that product from basket"});
            
        }

        private async Task<Basket> RetrivrBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets.Include(y => y.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerId); //insted 'buyerId' could be => Request.Cookies["buyerId"]
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                //creating Cookie for not log in user to work with annonymous basket
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            
            var basket = new Basket { BuyerId= buyerId };
            _context.Add(basket);
            return basket;
        }

        
    }
}