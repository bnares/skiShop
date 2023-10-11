using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;

        public OrdersController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToORderDto()
                .Where(x => x.BuyerId == User.Identity.Name).ToListAsync();
        }

        [HttpGet("{id}", Name ="GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToORderDto()
                .Where(X=>X.Id==id && X.BuyerId == User.Identity.Name).FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets.RetriveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();
            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not find basket" });
            var items = new List<OrderItems>();

            foreach(var item in basket.Items)
            {
                var productItems = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    Name = productItems.Name,
                    ProductId = productItems.Id,
                    PictureUrl = productItems.PictureUrl,
                };
                var orderedItems = new OrderItems
                {
                    ItemOrdered = itemOrdered,
                    Price = productItems.Price,
                    Quantity = item.Quantity,
                };
                items.Add(orderedItems);
                productItems.QuantityInStock = item.Quantity;
            }
            var subtotal = items.Sum(x => x.Quantity * x.Price);
            var deliveryFee = subtotal > 10000 ? 0 : 500;
            var order = new Order
            {
                OrderedItems = items,
                BuyerId = User.Identity.Name,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee,
                ShipingAddress = orderDto.ShippingAddress,
                PaymentIntentId = basket.PaymentIntentId,

            };
            _context.Orders.Add(order);
            _context.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _context.Users
                    .Include(a=>a.Address).FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Country = orderDto.ShippingAddress.Country,
                };
                user.Address = address;
            }
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
            return BadRequest("Problem creating order");


        }
    }
}
