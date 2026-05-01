-- Bảng users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    business_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    google_review_url TEXT NOT NULL,
    business_name TEXT NOT NULL,
    logo_url TEXT,
    thank_you_message TEXT DEFAULT 'Thank you for your review!',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng scans
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('positive', 'negative')),
    feedback_name TEXT,
    feedback_email TEXT,
    feedback_message TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Thông tin cổng thanh toán
    payment_provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'lemonsqueezy'
    provider_customer_id TEXT,             -- ID khách hàng bên Provider
    provider_subscription_id TEXT,         -- ID subscription bên Provider
    
    -- Thông tin gói
    plan_id VARCHAR(50),                   -- 'pro_monthly', 'pro_yearly'
    status VARCHAR(20) NOT NULL,           -- 'active', 'canceled', 'past_due', 'trialing'
    
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Index
CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_scans_campaign_id_scanned_at ON scans(campaign_id, scanned_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(payment_provider, provider_subscription_id);

-- ==========================================
-- STORED PROCEDURES
-- ==========================================

-- 1. Log a scan
CREATE OR REPLACE PROCEDURE sp_log_scan(
    p_campaign_id UUID,
    p_action VARCHAR,
    p_feedback_name TEXT,
    p_feedback_email TEXT,
    p_feedback_message TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO scans (campaign_id, action, feedback_name, feedback_email, feedback_message)
    VALUES (p_campaign_id, p_action, p_feedback_name, p_feedback_email, p_feedback_message);
END;
$$;

-- 2. Get Campaign Stats (Returns recordset, so we use Function returning TABLE in Postgres)
CREATE OR REPLACE FUNCTION fn_get_campaign_stats(p_campaign_id UUID)
RETURNS TABLE (
    total_scans BIGINT,
    positive_scans BIGINT,
    negative_scans BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) AS total_scans,
        SUM(CASE WHEN action = 'positive' THEN 1 ELSE 0 END) AS positive_scans,
        SUM(CASE WHEN action = 'negative' THEN 1 ELSE 0 END) AS negative_scans
    FROM scans
    WHERE campaign_id = p_campaign_id;
END;
$$;
