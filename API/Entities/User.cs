using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int> //by default in IdentityUser Id is of string type we changed that to be int by <int>
    {
        public UserAddress Address { get; set; }

    }
}
