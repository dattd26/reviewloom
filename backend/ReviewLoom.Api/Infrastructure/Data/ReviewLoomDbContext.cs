using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ReviewLoom.Api.Domain.Entities;

namespace ReviewLoom.Api.Infrastructure.Data;

public partial class ReviewLoomDbContext : DbContext
{
    public ReviewLoomDbContext()
    {
    }

    public ReviewLoomDbContext(DbContextOptions<ReviewLoomDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Campaign> Campaigns { get; set; }

    public virtual DbSet<Scan> Scans { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=reviewloomdb;Username=reviewloom_admin;Password=051124");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("campaigns_pkey");

            entity.ToTable("campaigns");

            entity.HasIndex(e => e.Slug, "campaigns_slug_key").IsUnique();

            entity.HasIndex(e => e.Slug, "idx_campaigns_slug");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.BusinessName).HasColumnName("business_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");
            entity.Property(e => e.GoogleReviewUrl).HasColumnName("google_review_url");
            entity.Property(e => e.LogoUrl).HasColumnName("logo_url");
            entity.Property(e => e.Slug).HasColumnName("slug");
            entity.Property(e => e.ThankYouMessage)
                .HasDefaultValueSql("'Thank you for your review!'::text")
                .HasColumnName("thank_you_message");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Campaigns)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("campaigns_user_id_fkey");
        });

        modelBuilder.Entity<Scan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("scans_pkey");

            entity.ToTable("scans");

            entity.HasIndex(e => new { e.CampaignId, e.ScannedAt }, "idx_scans_campaign_id_scanned_at");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.Action)
                .HasMaxLength(20)
                .HasColumnName("action");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.FeedbackEmail).HasColumnName("feedback_email");
            entity.Property(e => e.FeedbackMessage).HasColumnName("feedback_message");
            entity.Property(e => e.FeedbackName).HasColumnName("feedback_name");
            entity.Property(e => e.ScannedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("scanned_at");

            entity.HasOne(d => d.Campaign).WithMany(p => p.Scans)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("scans_campaign_id_fkey");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscriptions_pkey");

            entity.ToTable("subscriptions");

            entity.HasIndex(e => new { e.PaymentProvider, e.ProviderSubscriptionId }, "idx_subscriptions_provider");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");
            entity.Property(e => e.CurrentPeriodEnd).HasColumnName("current_period_end");
            entity.Property(e => e.PaymentProvider)
                .HasMaxLength(50)
                .HasColumnName("payment_provider");
            entity.Property(e => e.PlanId)
                .HasMaxLength(50)
                .HasColumnName("plan_id");
            entity.Property(e => e.ProviderCustomerId).HasColumnName("provider_customer_id");
            entity.Property(e => e.ProviderSubscriptionId).HasColumnName("provider_subscription_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("subscriptions_user_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.BusinessName).HasColumnName("business_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");
            entity.Property(e => e.Email).HasColumnName("email");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
