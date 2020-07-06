using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace FlashGordon.Models
{
    public partial class FlashCardsContext : DbContext
    {
        public FlashCardsContext()
        {
        }

        public FlashCardsContext(DbContextOptions<FlashCardsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Fcards> Fcards { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDb;Database=flash_cards;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Fcards>(entity =>
            {
                entity.ToTable("FCards");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Back)
                    .IsRequired()
                    .HasColumnName("back")
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasColumnName("category")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Front)
                    .IsRequired()
                    .HasColumnName("front")
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
