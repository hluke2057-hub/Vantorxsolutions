# scripts/verify_lead_emails_mx.ps1
# Pre-flight DNS & MX Shield for Outbound Leads
# Validates that recipient email domains actually exist and have active mail exchange (MX) servers before sending.

param(
    [string]$DomainToCheck
)

function Test-DomainMx([string]$domain) {
    if ([string]::IsNullOrWhiteSpace($domain)) { return $false }
    try {
        $records = Resolve-DnsName -Name $domain -Type MX -ErrorAction Stop
        if ($records -and $records.Count -gt 0) {
            return @{
                isValid = $true
                mxHost = $records[0].NameExchange
            }
        }
    } catch {
        return @{
            isValid = $false
            error = $_.Exception.Message
        }
    }
    return @{ isValid = $false; error = "No MX records found" }
}

if ($DomainToCheck) {
    $res = Test-DomainMx $DomainToCheck
    if ($res.isValid) {
        Write-Host "✅ Domain '$DomainToCheck' has VALID MX records: $($res.mxHost)" -ForegroundColor Green
    } else {
        Write-Host "❌ Domain '$DomainToCheck' FAILS MX check: $($res.error)" -ForegroundColor Red
    }
} else {
    Write-Host "Usage: ./scripts/verify_lead_emails_mx.ps1 -DomainToCheck toleelectric.com" -ForegroundColor Cyan
}
