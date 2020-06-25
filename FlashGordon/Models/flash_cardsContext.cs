using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace FlashGordon.Models
{
    public partial class flash_cardsContext : DbContext
    {
        public flash_cardsContext()
        {
        }

        public flash_cardsContext(DbContextOptions<flash_cardsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AngularFc> AngularFc { get; set; }
        public virtual DbSet<CsharpFc> CsharpFc { get; set; }
        public virtual DbSet<JavascriptFc> JavascriptFc { get; set; }
        public virtual DbSet<SqlFc> SqlFc { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDb;Database=flash_cards;Trusted_Connection=True;MultipleActiveResultSets=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AngularFc>(entity =>
            {
                entity.ToTable("angular_fc");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BackSide)
                    .HasColumnName("back_side")
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.FrontSide)
                    .HasColumnName("front_side")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.IsUsed).HasColumnName("is_used");
            });

            modelBuilder.Entity<CsharpFc>(entity =>
            {
                entity.ToTable("csharp_fc");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BackSide)
                    .HasColumnName("back_side")
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.FrontSide)
                    .HasColumnName("front_side")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.IsUsed).HasColumnName("is_used");
            });

            modelBuilder.Entity<JavascriptFc>(entity =>
            {
                entity.ToTable("javascript_fc");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BackSide)
                    .HasColumnName("back_side")
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.FrontSide)
                    .HasColumnName("front_side")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.IsUsed).HasColumnName("is_used");
            });

            modelBuilder.Entity<SqlFc>(entity =>
            {
                entity.ToTable("sql_fc");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BackSide)
                    .HasColumnName("back_side")
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.FrontSide)
                    .HasColumnName("front_side")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.IsUsed).HasColumnName("is_used");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
