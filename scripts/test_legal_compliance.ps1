# test_legal_compliance.ps1
# Comprehensive Verification of Legal & Regulatory Compliance
# Audits all 10 User-Identified Compliance Issues + 5 Latent Regulatory Requirements

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$root = $PSScriptRoot | Split-Path -Parent
$passCount = 0
$totalCount = 0

function Assert-Test {
    param(
        [string]$Description,
        [bool]$Condition,
        [string]$Details = ""
    )
    $script:totalCount++
    if ($Condition) {
        $script:passCount++
        Write-Host "  [PASS] $Description" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $Description" -ForegroundColor Red
        if ($Details) {
            Write-Host "         Details: $Details" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== VANTORX LEGAL & REGULATORY COMPLIANCE AUDIT SUITE ===" -ForegroundColor Cyan

# -------------------------------------------------------------
# 1. Privacy Policy Existence & Notice at Collection
# -------------------------------------------------------------
Write-Host "`n-- 1. Privacy Policy & Notice at Collection (Items #1 & #2) --" -ForegroundColor Yellow
$ppPath = Join-Path $root "website\privacy\index.html"
$ppExists = Test-Path $ppPath
Assert-Test "website/privacy/index.html exists" $ppExists

if ($ppExists) {
    $ppContent = [System.IO.File]::ReadAllText($ppPath, [System.Text.Encoding]::UTF8)
    
    Assert-Test "Privacy Policy contains Notice at Collection" ($ppContent -match "Notice at Collection" -or $ppContent -match "Categories of Personal Information")
    Assert-Test "Privacy Policy discloses user contact & business data collection" ($ppContent -match "Contact Information" -and $ppContent -match "Business Details")
    Assert-Test "Privacy Policy discloses voice call recordings & transcripts" ($ppContent -match "Voice Call Audio (&|&amp;) Transcripts")
    Assert-Test "Privacy Policy cites CalOPPA and CCPA / CPRA statutory rights" ($ppContent -match "CalOPPA" -and $ppContent -match "CCPA")
}

# -------------------------------------------------------------
# 2. AI Processing Disclosures (Item #3)
# -------------------------------------------------------------
Write-Host "`n-- 2. AI & Large Language Model Disclosures (Item #3) --" -ForegroundColor Yellow
if ($ppExists) {
    Assert-Test "Privacy Policy explicitly discloses AI voice and speech recognition" ($ppContent -match "Artificial Intelligence \(AI\) Voice Processing" -or $ppContent -match "AI Receptionist")
    Assert-Test "Privacy Policy names Large Language Models and voice synthesis" ($ppContent -match "Large Language Models" -and $ppContent -match "voice synthesis")
    Assert-Test "Privacy Policy prohibits training public models on user voice data" ($ppContent -match "do not permit sub-processors to use customer voice data or client conversations to train public foundation models")
}

# -------------------------------------------------------------
# 3. Third-Party Data Processors & Sub-Processors (Item #4)
# -------------------------------------------------------------
Write-Host "`n-- 3. Third-Party Sub-Processor Disclosures (Item #4) --" -ForegroundColor Yellow
if ($ppExists) {
    Assert-Test "Discloses Twilio for telephony & SMS" ($ppContent -match "Twilio Inc\.")
    Assert-Test "Discloses Stripe for payments & subscriptions" ($ppContent -match "Stripe, Inc\.")
    Assert-Test "Discloses Supabase for encrypted database storage" ($ppContent -match "Supabase Inc\.")
    Assert-Test "Discloses OpenAI for voice AI & language models" ($ppContent -match "OpenAI, LLC")
    Assert-Test "Discloses Resend for transactional email dispatch" ($ppContent -match "Resend, Inc\.")
    Assert-Test "Discloses Vercel for serverless API hosting" ($ppContent -match "Vercel Inc\.")
}

# -------------------------------------------------------------
# 4. Data Retention, User Uploads & Deletion Rights (Item #5)
# -------------------------------------------------------------
Write-Host "`n-- 4. User Upload Deletion & Retention Schedule (Item #5) --" -ForegroundColor Yellow
if ($ppExists) {
    Assert-Test "Defines explicit retention schedule (90-day voice audio purging)" ($ppContent -match "90 days" -and $ppContent -match "purged")
    Assert-Test "Discloses client deletion rights & support contact" ($ppContent -match "Right to Delete" -and $ppContent -match "privacy@vantorx")
    Assert-Test "Provides 30-day response window for CCPA/GDPR erasure requests" ($ppContent -match "30 calendar days")
}

# -------------------------------------------------------------
# 5. Storage Bucket Security & RLS (Item #6)
# -------------------------------------------------------------
Write-Host "`n-- 5. Storage Bucket Security & Encryption (Item #6) --" -ForegroundColor Yellow
if ($ppExists) {
    Assert-Test "Discloses TLS 1.3 in transit and AES-256 at rest encryption" ($ppContent -match "TLS 1\.3" -and $ppContent -match "AES-256")
    Assert-Test "Discloses Row-Level Security (RLS) tenant isolation" ($ppContent -match "Row-Level Security \(RLS\)")
    Assert-Test "Discloses no public unrestricted storage buckets" ($ppContent -match "Private by Default" -or $ppContent -match "strictly private")
}

# -------------------------------------------------------------
# 6. FTC Honest Reviews & Anti-Review Gating (Item #7)
# -------------------------------------------------------------
Write-Host "`n-- 6. FTC 16 CFR Part 465 Anti-Review Gating (Item #7) --" -ForegroundColor Yellow
$reviewPath = Join-Path $root "website\review\index.html"
$reviewExists = Test-Path $reviewPath
Assert-Test "website/review/index.html exists" $reviewExists

if ($reviewExists) {
    $reviewContent = [System.IO.File]::ReadAllText($reviewPath, [System.Text.Encoding]::UTF8)
    Assert-Test "Removed deceptive 'Private Owner Shield' framing" ($reviewContent -notmatch "Private Owner Shield")
    Assert-Test "Negative review screen provides direct public Google Review button" ($reviewContent -match 'id="negativeGoogleReviewBtn"' -and $reviewContent -match "Post Publicly to Google Reviews")
    Assert-Test "No coercive gate or conditional obstacle on public reviews" ($reviewContent -match "Direct Resolution Channel" -and $reviewContent -match "negativeGoogleReviewBtn")
}

# -------------------------------------------------------------
# 7. FTC Click-to-Cancel & Auto-Renewal Disclosures (Items #8 & #9)
# -------------------------------------------------------------
Write-Host "`n-- 7. FTC Click-to-Cancel & ROSCA Auto-Renewal (Items #8 & #9) --" -ForegroundColor Yellow
$tosPath = Join-Path $root "website\terms\index.html"
$tosExists = Test-Path $tosPath
Assert-Test "website/terms/index.html exists" $tosExists

if ($tosExists) {
    $tosContent = [System.IO.File]::ReadAllText($tosPath, [System.Text.Encoding]::UTF8)
    Assert-Test "Terms specifies FTC Click-to-Cancel 1-click self-serve cancellation" ($tosContent -match "1-Click Self-Serve Online Cancellation" -and $tosContent -match "16 CFR Part 425")
    Assert-Test "Terms specifies ROSCA & California ARL automatic renewal disclosures" ($tosContent -match "Automatic Renewal Terms" -and $tosContent -match "ROSCA")
    Assert-Test "Terms explicitly states no phone obstacle or mandatory sales call to cancel" ($tosContent -match "You are never required to call on the phone, undergo a mandatory retention interview, or speak with a sales representative to cancel")
}

$indexPath = Join-Path $root "website\index.html"
$indexContent = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
Assert-Test "Homepage pricing section contains auto-renewal & 1-click cancellation notice" ($indexContent -match "Subscriptions automatically renew on a month-to-month basis" -and $indexContent -match "Cancel anytime with a single click in your")

# -------------------------------------------------------------
# 8. AI Crisis Safety & Duty of Care Interceptors (Item #10)
# -------------------------------------------------------------
Write-Host "`n-- 8. AI Suicide Crisis Interceptor (Item #10) & 911 Guardrails --" -ForegroundColor Yellow
$receptionistPath = Join-Path $root "website\api\receptionist.js"
$recExists = Test-Path $receptionistPath
Assert-Test "website/api/receptionist.js exists" $recExists

if ($recExists) {
    $recContent = [System.IO.File]::ReadAllText($receptionistPath, [System.Text.Encoding]::UTF8)
    Assert-Test "Ava receptionist intercepts suicide & self-harm crisis keywords" ($recContent -match "988 Suicide & Crisis Lifeline" -and $recContent -match "CRISIS_INTERCEPTOR")
    Assert-Test "Crisis response directs caller to call or text 988 immediately" ($recContent -match "988" -and $recContent -match "Suicide & Crisis Lifeline" -and $recContent -match "free, confidential support 24/7")
    Assert-Test "Ava receptionist intercepts life-threatening 911 physical emergencies" ($recContent -match "EMERGENCY_INTERCEPTOR" -and $recContent -match "Ava cannot dispatch 911")
    Assert-Test "Emergency response advises immediate 911 call" ($recContent -match "Please hang up immediately and dial 911")
}

# -------------------------------------------------------------
# 9. Florida Wiretap / Two-Party Call Recording Disclosure (Latent Risk #1)
# -------------------------------------------------------------
Write-Host "`n-- 9. Two-Party Wiretap Call Recording Disclosure --" -ForegroundColor Yellow
if ($recExists) {
    Assert-Test "Ava receptionist opening greeting contains two-party recording disclosure" ($recContent -match "This call may be recorded for quality and training" -or $recContent -match "recorded for quality")
}
if ($tosExists) {
    Assert-Test "Terms of Service covers Call Recording & Two-Party Consent compliance" ($tosContent -match "Two-Party Call Recording (&|&amp;) Wiretap Consent" -and ($tosContent -match "Stat\. § 934\.03" -or $tosContent -match "934\.03"))
}

# -------------------------------------------------------------
# 10. TCPA Automated SMS Disclosures (Latent Risk #2)
# -------------------------------------------------------------
Write-Host "`n-- 10. TCPA Automated SMS Disclosures & Opt-Out --" -ForegroundColor Yellow
Assert-Test "Lead form contains express TCPA written consent and STOP opt-out" ($indexContent -match "express written consent under the TCPA" -and $indexContent -match "Reply STOP to cancel")
if ($tosExists) {
    Assert-Test "Terms of Service specifies TCPA SMS terms and STOP opt-out mechanism" ($tosContent -match "Telephone Consumer Protection Act \(TCPA\)" -and $tosContent -match "STOP")
}

# -------------------------------------------------------------
# 11. Website Navigation, Privacy Banner & Footer Integration
# -------------------------------------------------------------
Write-Host "`n-- 11. Website Navigation & Footer Integration --" -ForegroundColor Yellow
Assert-Test "Homepage footer links to /privacy/" ($indexContent -match 'href="/privacy/"')
Assert-Test "Homepage footer links to /terms/" ($indexContent -match 'href="/terms/"')
Assert-Test "Homepage includes privacy & cookie notice banner" ($indexContent -match 'id="cookieConsentBanner"')
Assert-Test "Privacy banner contains Accept and Dismiss buttons" ($indexContent -match 'id="acceptCookieConsent"' -and $indexContent -match 'id="dismissCookieConsent"')

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalCount | Passed: $passCount | Failed: ($($totalCount - $passCount))" -ForegroundColor $(if ($totalCount -eq $passCount) { "Green" } else { "Red" })
Write-Host "=======================================================`n" -ForegroundColor Cyan

if ($totalCount -ne $passCount) {
    exit 1
} else {
    exit 0
}
