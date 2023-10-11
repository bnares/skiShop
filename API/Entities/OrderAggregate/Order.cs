using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        [Required]
        public ShipingAddress ShipingAddress { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public List<OrderItems> OrderedItems { get; set; }
        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }
        public long GetTotal()
        {
            return Subtotal+ DeliveryFee;
        }

    }
}
