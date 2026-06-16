using System;
using Microsoft.EntityFrameworkCore;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Enums;

namespace ReviewLoom.Infrastructure.Data;

public partial class ReviewLoomDbContext : DbContext
{
    public ReviewLoomDbContext(DbContextOptions<ReviewLoomDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Campaign> Campaigns { get; set; }
    public virtual DbSet<CampaignStyle> CampaignStyles { get; set; }
    public virtual DbSet<CampaignSettings> CampaignSettings { get; set; }
    public virtual DbSet<CampaignStandeeConfig> CampaignStandeeConfigs { get; set; }
    public virtual DbSet<Scan> Scans { get; set; }
    public virtual DbSet<Subscription> Subscriptions { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<StandeeTemplate> StandeeTemplates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("campaigns_pkey");
            entity.ToTable("campaigns");
            entity.HasIndex(e => e.Slug, "campaigns_slug_key").IsUnique();
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.BusinessName).HasColumnName("business_name");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("created_at");
            entity.Property(e => e.GoogleReviewUrl).HasColumnName("google_review_url");
            entity.Property(e => e.LogoUrl).HasColumnName("logo_url");
            entity.Property(e => e.Slug).HasColumnName("slug");
            entity.Property(e => e.ThankYouMessage).HasDefaultValueSql("'Thank you for your review!'::text").HasColumnName("thank_you_message");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Status).HasColumnName("status").HasDefaultValue(CampaignStatus.Draft);

            entity.HasOne(d => d.User).WithMany(p => p.Campaigns)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("campaigns_user_id_fkey");

            // Navigation mappings for normalized components
            entity.HasOne(e => e.Style).WithOne(e => e.Campaign)
                .HasForeignKey<CampaignStyle>(e => e.CampaignId);
            entity.HasOne(e => e.Settings).WithOne(e => e.Campaign)
                .HasForeignKey<CampaignSettings>(e => e.CampaignId);
            entity.HasOne(e => e.StandeeConfig).WithOne(e => e.Campaign)
                .HasForeignKey<CampaignStandeeConfig>(e => e.CampaignId);
        });

        modelBuilder.Entity<CampaignStyle>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("campaign_styles_pkey");
            entity.ToTable("campaign_styles");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.PrimaryColor).HasMaxLength(10).HasDefaultValue("#0037b0").HasColumnName("primary_color");
            entity.Property(e => e.FontFamily).HasDefaultValue("Manrope").HasColumnName("font_family");
            entity.Property(e => e.LogoStyle).HasDefaultValue("soft").HasColumnName("logo_style");
            entity.Property(e => e.RatingIconType).HasDefaultValue("stars").HasColumnName("rating_icon_type");
            entity.Property(e => e.BackgroundStyle).HasDefaultValue("none").HasColumnName("background_style");
            entity.Property(e => e.BackgroundImage).HasColumnName("background_image");
            entity.Property(e => e.BackgroundGradient).HasColumnName("background_gradient");
            entity.Property(e => e.QrDotColor).HasMaxLength(10).HasDefaultValue("#000000").HasColumnName("qr_dot_color");
            entity.Property(e => e.QrFrame).HasDefaultValue("none").HasColumnName("qr_frame");
        });

        modelBuilder.Entity<CampaignSettings>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("campaign_settings_pkey");
            entity.ToTable("campaign_settings");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.RoutingThreshold).HasDefaultValue(4).HasColumnName("routing_threshold");
            entity.Property(e => e.Heading).HasDefaultValue("How was your experience?").HasColumnName("heading");
            entity.Property(e => e.CtaLabel).HasDefaultValue("Submit Feedback").HasColumnName("cta_label");
            entity.Property(e => e.ThankYouMessage).HasColumnName("thank_you_message");
            entity.Property(e => e.CollectContact).HasColumnName("collect_contact");
            entity.Property(e => e.IncentiveEnabled).HasColumnName("incentive_enabled");
            entity.Property(e => e.IncentiveCoupon).HasColumnName("incentive_coupon");
        });

        modelBuilder.Entity<CampaignStandeeConfig>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("campaign_standee_configs_pkey");
            entity.ToTable("campaign_standee_configs");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.TemplateId).HasDefaultValue("minimal_white").HasColumnName("template_id");
            entity.Property(e => e.CtaText).HasColumnName("cta_text");
            entity.Property(e => e.ShowLogo).HasDefaultValue(true).HasColumnName("show_logo");

            // Relationship configuration
            entity.HasOne(e => e.Template)
                .WithMany()
                .HasForeignKey(e => e.TemplateId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("campaign_standee_configs_template_id_fkey");
        });

        modelBuilder.Entity<StandeeTemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("standee_templates_pkey");
            entity.ToTable("standee_templates");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").IsRequired();
            entity.Property(e => e.Category).HasColumnName("category").IsRequired();
            entity.Property(e => e.IsPremium).HasColumnName("is_premium");
            entity.Property(e => e.ThumbnailUrl).HasColumnName("thumbnail_url").IsRequired();
            entity.Property(e => e.SchemaJson).HasColumnType("jsonb").HasColumnName("schema_json").IsRequired();
        });

        modelBuilder.Entity<StandeeTemplate>().HasData(
            new StandeeTemplate { Id = "minimal_white", Name = "Minimal White", Category = "general", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"minimal_white\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "prestige_dark", Name = "Prestige Dark", Category = "general", IsPremium = true, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"prestige_dark\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "salon_blush", Name = "Salon Blush", Category = "salon", IsPremium = true, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"salon_blush\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "cafe_kraft", Name = "Cafe Kraft", Category = "coffee", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"cafe_kraft\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "restaurant-modern", Name = "Modern Table", Category = "restaurant", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"restaurant-modern\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "restaurant-elegant", Name = "Elegant Dining", Category = "restaurant", IsPremium = true, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"restaurant-elegant\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "restaurant-casual", Name = "Fast Casual", Category = "restaurant", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"restaurant-casual\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "coffee-minimal", Name = "Minimal Coffee", Category = "coffee", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"coffee-minimal\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "coffee-cozy", Name = "Cozy Cafe", Category = "coffee", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"coffee-cozy\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "coffee-premium", Name = "Premium Coffee", Category = "coffee", IsPremium = true, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"coffee-premium\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "salon-minimal", Name = "Beauty Minimal", Category = "salon", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"salon-minimal\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "salon-luxury", Name = "Luxury Spa", Category = "salon", IsPremium = true, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"salon-luxury\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "salon-barber", Name = "Modern Barber", Category = "salon", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"salon-barber\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "services-hvac", Name = "HVAC Trust", Category = "services", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"services-hvac\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "services-roofing", Name = "Roofing Pro", Category = "services", IsPremium = false, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"services-roofing\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" },
            new StandeeTemplate { Id = "services-plumbing", Name = "Plumbing Expert", Category = "services", IsPremium = true, ThumbnailUrl = "", SchemaJson = "{\"layout\": \"services-plumbing\", \"editableFields\": [\"logo\", \"businessName\", \"ctaText\", \"qrCode\"]}" }
        );

        modelBuilder.Entity<Scan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("scans_pkey");
            entity.ToTable("scans");
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.Action).HasMaxLength(20).HasColumnName("action");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.FeedbackEmail).HasColumnName("feedback_email");
            entity.Property(e => e.FeedbackMessage).HasColumnName("feedback_message");
            entity.Property(e => e.FeedbackName).HasColumnName("feedback_name");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("unread").HasColumnName("status");
            entity.Property(e => e.ReplyMessage).HasColumnName("reply_message");
            entity.Property(e => e.RepliedAt).HasColumnName("replied_at");
            entity.Property(e => e.ScannedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("scanned_at");

            entity.HasOne(d => d.Campaign).WithMany(p => p.Scans)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("scans_campaign_id_fkey");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscriptions_pkey");
            entity.ToTable("subscriptions");
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()").HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("created_at");
            entity.Property(e => e.CurrentPeriodEnd).HasColumnName("current_period_end");
            entity.Property(e => e.PaymentProvider).HasMaxLength(50).HasColumnName("payment_provider");
            entity.Property(e => e.PlanId).HasMaxLength(50).HasColumnName("plan_id");
            entity.Property(e => e.ProviderCustomerId).HasColumnName("provider_customer_id");
            entity.Property(e => e.ProviderSubscriptionId).HasColumnName("provider_subscription_id");
            entity.Property(e => e.Status).HasMaxLength(20).HasColumnName("status");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("subscriptions_user_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");
            entity.ToTable("users");
            entity.Property(e => e.Id).ValueGeneratedNever().HasColumnName("id");
            entity.Property(e => e.BusinessName).HasColumnName("business_name");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP").HasColumnName("created_at");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.ClerkId).HasColumnName("clerk_id");

            entity.HasIndex(e => e.ClerkId, "users_clerk_id_key").IsUnique();
        });
    }
}
