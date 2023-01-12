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
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<SupplierOrder>()
                .HasMany(i => i.SupplierOrderDetail)
                .WithOne(i => i.SupplierOrder)
                .OnDelete(DeleteBehavior.NoAction);

            base.OnModelCreating(builder);
            builder.Entity<Receipt>()
                .HasMany(i => i.ReceiptDetails)
                .WithOne(i => i.Receipt)
                .OnDelete(DeleteBehavior.NoAction);

            base.OnModelCreating(builder);
            builder.Entity<CreditMemo>()
                .HasMany(i => i.CreditMemoDetail)
                .WithOne(i => i.CreditMemo)
                .OnDelete(DeleteBehavior.NoAction);
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
        public virtual DbSet<Invoice> Invoices { get; set; }
        public virtual DbSet<InvoiceDetail> InvoiceDetails { get; set; }
        public virtual DbSet<Receipt> Receipts { get; set; }
        public virtual DbSet<ReceiptDetails> ReceiptDetails { get; set; }
        public virtual DbSet<CreditMemo> CreditMemo { get; set; }
        public virtual DbSet<CreditMemoDetail> CreditMemoDetail { get; set; }


        public virtual DbSet<Period> Periods { get; set; }
        public virtual DbSet<DebitMemo> DebitMemos { get; set; }


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
