using Kiltex.SistemaGestion.Domain.Model;
using Microsoft.EntityFrameworkCore;


namespace Kiltex.SistemaGestion.Domain
{
    public class DBContext : DbContext
    {
        public DBContext()
        {

        }
        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {

        }
        public virtual DbSet<Rol> Rols { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Permission> Permissions { get; set; }
        public virtual DbSet<PermissionXRol> PermissionXRols { get; set; }
        public virtual DbSet<Brand> Brands { get; set; }
        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Entity> Entities { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<EmailEntity> EmailEntities { get; set; }
        public virtual DbSet<PhoneEntity> PhoneEntities { get; set; }
        public virtual DbSet<SupplierOrder> SupplierOrders { get; set; }
        public virtual DbSet<SupplierOrderDetail> SupplierOrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
        //private static void InitialRoles(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Rol>().HasData(
        //        new Rol()
        //        {
        //            Id = Enums.Rols.Admin,
        //            Name = Enums.ERols.Admin
        //        }
        //    );
        //}; 
       
    }
}
