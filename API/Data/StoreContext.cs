using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User,Role,int> //Role - typed of class we use to specify Role (need this as we create Role class which inherit from IdentityRole, if would have used IdentityROle we hadn't had to write Role,int in the end ). int is a type used for primery key in this class
    {
        public StoreContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<Order> Orders { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {

            builder.Entity<User>()
                .HasOne(x => x.Address)
                .WithOne()
                .HasForeignKey<UserAddress>(x => x.Id)
                .OnDelete(DeleteBehavior.Cascade); //we want the userAddress to be deleted if we delet user

            base.OnModelCreating(builder);
            builder.Entity<Role>()
                .HasData(
                    new Role {Id=1, Name = "Member", NormalizedName="MEMBER" },
                    new Role {Id=2, Name = "Admin", NormalizedName="ADMIN"}
                );

        }
    }
}