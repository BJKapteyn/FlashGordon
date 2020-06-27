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

        public virtual DbSet<AngularFC> AngularFc { get; set; }
        public virtual DbSet<CsharpFC> CsharpFc { get; set; }
        public virtual DbSet<JavascriptFC> JavascriptFc { get; set; }
        public virtual DbSet<SqlFC> SqlFc { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDb;Database=flash_cards;Trusted_Connection=True;MultipleActiveResultSets=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AngularFC>(entity =>
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

            modelBuilder.Entity<CsharpFC>(entity =>
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

            modelBuilder.Entity<JavascriptFC>(entity =>
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

            modelBuilder.Entity<SqlFC>(entity =>
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
