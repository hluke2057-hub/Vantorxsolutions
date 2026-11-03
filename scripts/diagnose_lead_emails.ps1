$content = Get-Content "data/verified_targets_queue.json" -Raw | ConvertFrom-Json
$withEmail = $content | Where-Object { $_.email }

Write-Host "Testing MX records for all $($withEmail.Count) emails in verified_targets_queue.json..."

$results = @()

foreach ($lead in $withEmail) {
    $email = $lead.email
    $domain = $email.Split('@')[1]
    $mxValid = $false
    $mxHost = ""
    $err = ""

    try {
        $dns = Resolve-DnsName -Name $domain -Type MX -ErrorAction Stop
        if ($dns -and $dns.Count -gt 0) {
            $mxValid = $true
            $mxHost = $dns[0].NameExchange
        }
    } catch {
        $err = $_.Exception.Message
    }

    $status = if ($mxValid) { "✅ VALID" } else { "❌ BOUNCE RISK ($err)" }
    Write-Host "$($lead.id) | $($lead.company) | $email -> $status"
    $results += [PSCustomObject]@{
        id = $lead.id
        company = $lead.company
        email = $email
        domain = $domain
        mxValid = $mxValid
        mxHost = $mxHost
    }
}

$realDomains = @(
    "palmairac.com",
    "delair.com",
    "whaleroofing.com",
    "garabar.com",
    "ericasplumbing.com",
    "cousinsair.com",
    "toleelectric.com",
    "sansone-ac.com",
    "ecmaircon.com",
    "eliteelectricandair.com",
    "ewingair.com",
    "friendlyac.com",
    "southerncoastservices.com",
    "forteroofing.com",
    "aastroroofingcompany.com",
    "misterplumberinc.com",
    "molsbeeroofinginc.com"
)

Write-Host "`nTesting real Florida contractor domains:"
foreach ($d in $realDomains) {
    try {
        $dns = Resolve-DnsName -Name $d -Type MX -ErrorAction Stop
        if ($dns -and $dns.Count -gt 0) {
            Write-Host "✅ $d -> MX: $($dns[0].NameExchange)"
        }
    } catch {
        Write-Host "❌ $d -> Failed: $($_.Exception.Message)"
    }
}




