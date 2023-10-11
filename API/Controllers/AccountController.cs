using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();
            var userBasket = await RetrivrBasket(loginDto.Username);
            var anonBasket = await RetrivrBasket(Request.Cookies["buyerId"]);
            if (anonBasket != null)
            {
                if (userBasket != null) _context.Baskets.Remove(userBasket);

                anonBasket.BuyerId = user.UserName; //or User.Identity.Name could be here
                Response.Cookies.Delete("buyerId"); // to remove from user console that cookie
                await _context.SaveChangesAsync();
            }
            if (anonBasket == null && userBasket == null)
            {
                return new UserDto
                {
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user),
                    Basket = new BasketDto{BuyerId = user.UserName, Items = new ()}
                };
            }
            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonBasket != null ? anonBasket.ConvertBasketToBasketDto() :
                        userBasket.ConvertBasketToBasketDto()
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User { UserName = registerDto.Username,Email = registerDto.Email };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");
            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> CurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name); //get name claim from token
            var userBasket = await RetrivrBasket(User.Identity.Name);
            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket.ConvertBasketToBasketDto(),
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            //var result = await _userManager.Users.Where(x => x.UserName == User.Identity.Name)
            //    .Select(user => user.Address).FirstOrDefaultAsync();
            try
            {
                var test = await _context.Users.Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address).FirstOrDefaultAsync();

            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }
            var result = await _context.Users.Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address).FirstOrDefaultAsync();
            return result;
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

    }
}
