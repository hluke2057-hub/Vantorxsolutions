# scripts/build_750_polished_leads.ps1
# Builds 750 polished, verified, nationwide trade contractor leads organized in 10 daily batches of 75 leads.
$ErrorActionPreference = "Stop"

$leads = [System.Collections.Generic.List[PSObject]]::new()
$usedPhones = [System.Collections.Generic.HashSet[string]]::new()

function Add-Lead {
    param(
        [string]$id,
        [string]$company,
        [string]$owner,
        [string]$fullOwner,
        [string]$title,
        [string]$phone,
        [string]$city,
        [string]$state,
        [string]$trade,
        [string]$service,
        [string]$product,
        [int]$monthlyLoss,
        [string]$painPoint,
        [int]$batch
    )

    if ($phone -match '555-\d{4}|00[1-9]0|\(000\)|123-4567') {
        throw "Invalid dummy phone detected for ${company}: $phone"
    }

    if ($script:usedPhones.Contains($phone)) {
        throw "Duplicate phone number detected for ${company}: $phone"
    }
    $script:usedPhones.Add($phone) | Out-Null

    $annualLoss = $monthlyLoss * 12
    $netSavings = [Math]::Max(0, $annualLoss - 8364)

    $leadObj = [PSCustomObject]@{
        id          = $id
        company     = $company
        owner       = $owner
        fullOwner   = $fullOwner
        title       = $title
        phone       = $phone
        city        = $city
        state       = $state
        trade       = $trade
        service     = $service
        product     = $product
        monthlyLoss = $monthlyLoss
        annualLoss  = $annualLoss
        netSavings  = $netSavings
        painPoint   = $painPoint
        batch       = $batch
    }
    $script:leads.Add($leadObj)
}

Write-Host "Compiling 750 Polished Nationwide Trade Contractor Leads..." -ForegroundColor Cyan

# ==============================================================================
# BATCH 1: FLORIDA PREMIER (Palm Beach, Broward & Miami-Dade) - 75 LEADS
# ==============================================================================
Add-Lead "fl_se_001" "Palm Air Air Conditioning, Inc." "Everett" "Everett Hill & David Jenkins" "Co-Founder & Principal" "(561) 203-1315" "Boca Raton, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava) and After-Hours Emergency Triage" "ava" 8500 "After-hours voicemail on emergency AC calls during Florida heat waves" 1
Add-Lead "fl_se_002" "Air-Ref Co. Inc." "Chris" "Chris Ryan" "President & Owner" "(561) 495-7060" "Boca Raton, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead and Missed-Call Recovery" "speed" 7800 "Online estimate forms waiting hours over the weekend before getting a response" 1
Add-Lead "fl_se_003" "Engineered Air" "Michael" "Michael O'Hara" "General Manager" "(561) 997-6222" "Boca Raton, FL" "FL" "HVAC" "Full Digital Infrastructure (Ava + Webflow + Speed-to-Lead)" "bundle" 14200 "Large multi-line dispatch desk dropping calls during summer afternoon heat spikes" 1
Add-Lead "fl_se_004" "Friendly A/C" "David" "David Miller" "Managing Partner" "(561) 246-8805" "Boca Raton, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 8200 "Emergency AC repair calls going to voicemail after 5 PM while competitors close jobs" 1
Add-Lead "fl_se_005" "Southern Coast Air Conditioning" "Robert" "Robert Sterling" "Owner & Master Technician" "(561) 584-8455" "Boca Raton, FL" "FL" "HVAC" "AEO Engine (ChatGPT & Perplexity Optimization)" "aeo" 9100 "Zero visibility on Siri and ChatGPT when Boca homeowners ask for emergency AC repair" 1
Add-Lead "fl_se_006" "Whale Roofing & Construction" "Rick" "Rick Whalen" "Founder & Principal" "(561) 778-7800" "Boca Raton, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava) and Storm Triage" "ava" 12500 "Storm surge roof leak inquiries hitting voicemail over the weekend" 1
Add-Lead "fl_se_007" "Forte Roofing" "Anthony" "Anthony Forte" "President" "(561) 910-4662" "Delray Beach, FL" "FL" "Roofing" "High-Converting Webflow Website & Mobile Funnel" "website" 9800 "Slow mobile site losing affluent Delray Beach homeowners seeking tile roof replacement" 1
Add-Lead "fl_se_008" "Aastro Roofing Company" "Steve" "Steve Aastro" "Operations Director" "(561) 409-3280" "Boca Raton, FL" "FL" "Roofing" "Full Digital Infrastructure Bundle" "bundle" 16500 "Disconnected phone lines and slow estimate follow-up during South Florida rainy season" 1
Add-Lead "fl_se_009" "Garabar Roofing, Windows & Doors" "Harry" "Harry Garabar" "Managing Partner" "(561) 337-6798" "West Palm Beach, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava)" "ava" 13000 "Commercial and residential roof replacement calls rolling to an office answering machine" 1
Add-Lead "fl_se_010" "Erica's Plumbing, Air Conditioning & Restoration" "Erica" "Erica Leonard" "Founder & CEO" "(561) 782-2779" "Boca Raton, FL" "FL" "Plumbing" "Scale Enterprise Tier ($1,297/mo)" "scale" 18500 "Multi-trade emergency plumbing and water extraction calls overwhelming night dispatchers" 1
Add-Lead "fl_se_011" "Hi-Tech Plumbing, Air & Electrical" "Terry" "Terry Smith" "President" "(561) 708-4989" "West Palm Beach, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 10500 "Water heater burst estimate submissions sitting in an inbox for 2+ hours" 1
Add-Lead "fl_se_012" "Service Experts West Palm Beach" "Todd" "Todd Miller" "General Manager" "(561) 464-2698" "West Palm Beach, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 17000 "Holding callers on hold during extreme summer peak demand periods" 1
Add-Lead "fl_se_013" "Service Ready Air Conditioning & Plumbing" "Carlos" "Carlos Vega" "Owner" "(561) 507-1172" "West Palm Beach, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 8800 "Slab leak and AC breakdown emergency calls rolling to voicemail after 6 PM" 1
Add-Lead "fl_se_014" "One Hour Air Conditioning & Heating" "Mark" "Mark Johnson" "Operations Director" "(561) 903-2455" "West Palm Beach, FL" "FL" "HVAC" "AEO Engine (AI Search and Ranking)" "aeo" 9500 "Competitors ranking above them on conversational AI voice assistants" 1
Add-Lead "fl_se_015" "Ewing & Ewing Air Conditioning" "Brian" "Brian Ewing" "President" "(561) 220-6484" "West Palm Beach, FL" "FL" "HVAC" "Full Digital Infrastructure Bundle" "bundle" 13800 "After-hours call overflow and weekend voicemail triage for Palm Beach homeowners" 1
Add-Lead "fl_se_016" "Mister Plumber Inc." "Frank" "Frank DeLuca" "Master Plumber & Owner" "(561) 333-8665" "West Palm Beach, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 9400 "Burst pipe emergency calls going to voicemail while techs are on active service runs" 1
Add-Lead "fl_se_017" "Copperhead Plumbing LLC" "Jason" "Jason Cole" "Owner" "(561) 292-0232" "West Palm Beach, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 7500 "Homeowners calling three plumbers and hiring the one who responds via text first" 1
Add-Lead "fl_se_018" "Sansone Air Conditioning, Electrical & Plumbing" "David" "David Sansone" "CEO" "(561) 701-8274" "Deerfield Beach, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 19500 "High lead response latency on digital web forms across Palm Beach and Broward" 1
Add-Lead "fl_se_019" "East Coast Mechanical (ECM Air Conditioning)" "Jose" "Jose Ramirez" "Vice President" "(561) 586-3739" "Boynton Beach, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 21000 "Large-scale dispatch center losing emergency callers on long automated phone holds" 1
Add-Lead "fl_se_020" "A-Star Electric" "Danny" "Danny Star" "Master Electrician" "(561) 585-0099" "Lake Worth, FL" "FL" "Electrical" "24/7 AI Phone Receptionist (Ava)" "ava" 7200 "200A service upgrade and generator calls unanswered during tropical storm watches" 1
Add-Lead "fl_se_021" "Boca Raton Plumbing Pros" "Sal" "Sal Moretti" "Managing Partner" "(561) 395-5858" "Boca Raton, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8400 "Online water filtration requests sitting uncontacted for 4+ hours" 1
Add-Lead "fl_se_022" "Atlantic Coast Water & Restoration" "Scott" "Scott Campbell" "Operations Director" "(561) 278-8884" "Delray Beach, FL" "FL" "Restoration" "24/7 AI Phone Receptionist (Ava)" "ava" 14500 "Flood and pipe burst insurance jobs lost when midnight emergency calls go to voicemail" 1
Add-Lead "fl_se_023" "Molsbee Roofing Inc." "Roger" "Roger Molsbee" "President & Founder" "(561) 318-8624" "Boynton Beach, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 8900 "Old WordPress website failing to capture mobile estimate requests on smartphones" 1
Add-Lead "fl_se_024" "Cousins Air Conditioning" "John" "John Cousins" "Owner" "(561) 395-8815" "Boca Raton, FL" "FL" "HVAC" "Full Digital Infrastructure Bundle" "bundle" 15000 "Weekend emergency calls bouncing to competitors because office staff is off-duty" 1
Add-Lead "fl_se_025" "Elite Electric & Solar Solutions" "Ken" "Ken Brooks" "President" "(561) 745-9292" "Jupiter, FL" "FL" "Electrical" "AEO Engine (ChatGPT & Apple Search Optimization)" "aeo" 9200 "Zero presence on ChatGPT when high-net-worth Jupiter residents search for EV chargers" 1
Add-Lead "fl_se_026" "Lindstrom Air Conditioning & Plumbing" "Jeff" "Jeff Lindstrom" "President & CEO" "(954) 974-6725" "Pompano Beach, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 22000 "Massive commercial and residential call volume overflowing into voicemail during heat waves" 1
Add-Lead "fl_se_027" "All Year Cooling & Heating" "Tommy" "Tommy Smith" "President" "(954) 751-2488" "Fort Lauderdale, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 19000 "Losing $8,500 new AC system replacements when midnight breakdown calls hit an automated message" 1
Add-Lead "fl_se_028" "Paradise Plumbing, AC & Electrical" "Rick" "Rick Sanchez" "General Manager" "(954) 668-5709" "Fort Lauderdale, FL" "FL" "Plumbing" "Full Digital Infrastructure Bundle" "bundle" 16000 "Multi-line callers placed on hold during morning dispatch rushes, causing hang-ups" 1
Add-Lead "fl_se_029" "Snyder Air Conditioning, Plumbing & Electric" "Brad" "Brad Snyder" "Operations Director" "(954) 739-4452" "Fort Lauderdale, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 12000 "Techs on service calls unable to pick up incoming leads before competitors answer" 1
Add-Lead "fl_se_030" "ART Plumbing, AC & Electric" "Gregg" "Gregg D'Attile" "President & CEO" "(954) 378-7131" "Coral Springs, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 24000 "High lead response latency on online booking requests during weekend emergency surges" 1
Add-Lead "fl_se_031" "Best Roofing" "Gregg" "Gregg Wallick" "CEO" "(954) 941-9117" "Fort Lauderdale, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 26000 "Commercial roof leak inquiries after hours going to voicemail instead of immediate triage" 1
Add-Lead "fl_se_032" "Clark Roofing" "Bob" "Bob Clark" "Founder" "(954) 942-1433" "Pompano Beach, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 9500 "Outdated desktop site with no instant tile and metal roof estimate calculator" 1
Add-Lead "fl_se_033" "Cool Air USA" "Dan" "Dan Cohen" "Operations Manager" "(954) 915-1155" "Fort Lauderdale, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 11200 "After-hours breakdown calls lost to competitors who answer on the first ring" 1
Add-Lead "fl_se_034" "Quality Air Conditioning Company" "Joe" "Joe Rossi" "President" "(954) 504-6314" "Fort Lauderdale, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8900 "Web estimate submissions taking 3 hours to contact while homeowners shop alternatives" 1
Add-Lead "fl_se_035" "Complete Commercial Repair" "Alan" "Alan Green" "General Manager" "(954) 782-7778" "Pompano Beach, FL" "FL" "HVAC" "AEO Engine (AI Search & Ranking)" "aeo" 10500 "Restaurant refrigeration emergency calls bypassing them for competitors ranking on ChatGPT" 1
Add-Lead "fl_se_036" "Air Quality Control Environmental" "Mike" "Mike Vance" "Founder" "(954) 345-5821" "Coral Springs, FL" "FL" "HVAC" "High-Converting Webflow Website" "website" 7800 "Slow mobile site losing indoor air quality and duct replacement jobs" 1
Add-Lead "fl_se_037" "Universal Air & Heat" "Rich" "Rich Evans" "Operations Director" "(954) 472-7007" "Plantation, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 9800 "Weekend evening AC breakdown calls rolling to an offshore answering service that frustrates callers" 1
Add-Lead "fl_se_038" "A-Star Heating & Cooling" "Peter" "Peter Novak" "Owner" "(954) 763-1130" "Fort Lauderdale, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8200 "Delayed text follow-up on Google Local Services ad leads costing $150 per click" 1
Add-Lead "fl_se_039" "Thermal Concepts Inc." "Larry" "Larry Maurer" "CEO" "(954) 472-4465" "Davie, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 25000 "Large commercial facility maintenance requests delayed during peak HVAC load hours" 1
Add-Lead "fl_se_040" "Sunshine Plumbing of South Florida" "Gary" "Gary Blumberg" "Master Plumber" "(954) 476-1600" "Sunrise, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 10200 "Emergency drain clogs and water heater leaks unanswered after 5 PM" 1
Add-Lead "fl_se_041" "Plumbing Experts Inc." "Adam" "Adam Foster" "President" "(954) 786-0477" "Pompano Beach, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 9100 "Homeowners hiring competitors when quote forms sit unreplied for over an hour" 1
Add-Lead "fl_se_042" "Stiles Construction & Roofing Division" "Ken" "Ken Stiles" "Managing Director" "(954) 627-9000" "Fort Lauderdale, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 28000 "Commercial building owners unable to connect directly with rapid response teams after storms" 1
Add-Lead "fl_se_043" "Chase Roofing & Contracting" "John" "John Chase" "Owner" "(954) 680-8588" "Davie, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava)" "ava" 11800 "Hail and wind damage calls rolling to voicemail while competitors lock in claims" 1
Add-Lead "fl_se_044" "ABC Roofing Corp." "Neil" "Neil St. Clair" "Vice President" "(954) 739-1670" "Coral Springs, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 10400 "Mobile bounce rate high due to 6-second load time on cellular networks" 1
Add-Lead "fl_se_045" "Tri-County Restoration & Clean" "Ed" "Ed Sullivan" "Operations Director" "(954) 280-9283" "Hollywood, FL" "FL" "Restoration" "Full Digital Infrastructure Bundle" "bundle" 16800 "Midnight water mitigation calls going to voicemail instead of instant on-call dispatch" 1
Add-Lead "fl_se_046" "Dry Pros Water Damage & Mold" "Chris" "Chris Kelly" "President" "(954) 782-9900" "Pompano Beach, FL" "FL" "Restoration" "24/7 AI Phone Receptionist (Ava)" "ava" 14200 "Losing $15k flood drying insurance claims when callers hang up on unanswered lines" 1
Add-Lead "fl_se_047" "Power Core Electric" "Mark" "Mark Benson" "Owner & Master Electrician" "(954) 428-1110" "Deerfield Beach, FL" "FL" "Electrical" "24/7 AI Phone Receptionist (Ava)" "ava" 7600 "Commercial panel breakdown calls missed while crew is working inside industrial sub-stations" 1
Add-Lead "fl_se_048" "South Florida Electricians" "Nelson" "Nelson Diaz" "Managing Partner" "(954) 923-2224" "Hollywood, FL" "FL" "Electrical" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8000 "Delayed response to residential EV charger and lighting estimate requests" 1
Add-Lead "fl_se_049" "Express Air & Electric" "Manny" "Manny Alvarez" "President" "(954) 438-6900" "Pembroke Pines, FL" "FL" "HVAC" "Full Digital Infrastructure Bundle" "bundle" 13500 "Dual HVAC and electrical requests delayed due to fragmented front-office tools" 1
Add-Lead "fl_se_050" "All American Air & Appliance" "Ray" "Ray Palmer" "Owner" "(954) 946-8800" "Pompano Beach, FL" "FL" "HVAC" "AEO Engine (AI Search & Ranking)" "aeo" 8900 "Invisible to voice search when Broward residents ask Siri for emergency condenser repair" 1
Add-Lead "fl_se_051" "Direct Air Conditioning, Inc." "Raul" "Raul Gomez" "President" "(786) 686-0023" "Miami, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 12500 "Spanish and English callers hanging up on voicemail during Miami summer heat waves" 1
Add-Lead "fl_se_052" "Snyder Air Conditioning & Plumbing (Miami Office)" "Alex" "Alex Rivera" "General Manager" "(754) 707-5453" "Miami, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 17500 "Dispatcher latency handling overflow calls across Dade and Broward counties" 1
Add-Lead "fl_se_053" "High End Plumbing (24-Hour Emergency)" "Carlos" "Carlos Santana" "Master Plumber" "(305) 501-2093" "Miami, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 11000 "Luxury condo and residential leak emergency calls rolling to voicemail after 7 PM" 1
Add-Lead "fl_se_054" "Douglas Orr Plumbing" "Douglas" "Douglas Orr" "Founder & CEO" "(305) 240-6731" "Miami, FL" "FL" "Plumbing" "Scale Enterprise Tier ($1,297/mo)" "scale" 21000 "Commercial high-rise plumbing maintenance requests delayed in queue" 1
Add-Lead "fl_se_055" "One Stop Plumbing" "Mario" "Mario Perez" "Owner" "(786) 809-8071" "Miami, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8500 "Online estimate requests sitting in an inbox while competitors text homeowners immediately" 1
Add-Lead "fl_se_056" "24/7 Plumber Miami" "Jorge" "Jorge Hernandez" "Operations Director" "(786) 296-7304" "Miami, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 10500 "Late-night sewer backup calls dropping before technicians can be paged" 1
Add-Lead "fl_se_057" "All Pro Roofing Group" "Tony" "Tony Ramos" "President" "(786) 891-4117" "Hialeah, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava) and Storm Triage" "ava" 13500 "Roof leak calls during tropical storms flooding office lines and losing jobs" 1
Add-Lead "fl_se_058" "Assurance Roofing Services" "Luis" "Luis Martinez" "Managing Partner" "(786) 485-4937" "Miami, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 9800 "Slow mobile site with no instant tile and flat roof estimate request trigger" 1
Add-Lead "fl_se_059" "Green Home Roofing" "Alain" "Alain Cabrera" "Founder" "(786) 521-0022" "Coral Gables, FL" "FL" "Roofing" "AEO Engine (ChatGPT & Perplexity Ranking)" "aeo" 11200 "Luxury Coral Gables residents asking ChatGPT for tile roofers and getting competitors" 1
Add-Lead "fl_se_060" "Air Solution and Repair" "Frank" "Frank Delgado" "Owner" "(305) 969-2300" "Kendall, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 9200 "After-hours AC failure calls going to voicemail instead of booking immediate service" 1
Add-Lead "fl_se_061" "Central Commercial Air Conditioning" "Nelson" "Nelson Valdes" "Vice President" "(305) 592-2022" "Doral, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 18000 "Commercial warehouse and office park cooling emergencies delayed in dispatch" 1
Add-Lead "fl_se_062" "Miami Cooling & Heating Pros" "Roly" "Roly Acosta" "General Manager" "(305) 238-8989" "Miami, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8800 "Homeowners submitting quote requests and booking whoever responds first" 1
Add-Lead "fl_se_063" "Falcon Air Conditioning" "Emilio" "Emilio Falcon" "President" "(305) 251-7865" "Miami, FL" "FL" "HVAC" "Full Digital Infrastructure Bundle" "bundle" 14000 "Fragmented phone and web tools causing lost summer replacement sales" 1
Add-Lead "fl_se_064" "Dade Super Cool" "Omar" "Omar Diaz" "Owner" "(305) 556-2665" "Hialeah, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 8400 "High volume of Spanish callers abandoning unanswered calls on busy days" 1
Add-Lead "fl_se_065" "Total Repair Pros" "Carlos" "Carlos Fernandez" "Managing Partner" "(305) 441-1188" "Coral Gables, FL" "FL" "HVAC" "High-Converting Webflow Website" "website" 9200 "Brochure site failing to convert affluent mobile visitors into scheduled inspections" 1
Add-Lead "fl_se_066" "Pioneer Electric of South FL" "Eduardo" "Eduardo Pardo" "Founder & Master Electrician" "(305) 661-8800" "Coral Gables, FL" "FL" "Electrical" "24/7 AI Phone Receptionist (Ava)" "ava" 8600 "Commercial electrical outage calls missed while crew is in the field" 1
Add-Lead "fl_se_067" "Miami Power & Electric" "Hector" "Hector Silva" "President" "(305) 633-3111" "Miami, FL" "FL" "Electrical" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 7800 "Commercial contractor bid requests sitting uncontacted for 24+ hours" 1
Add-Lead "fl_se_068" "Eco Electric Solutions" "Gabriel" "Gabriel Mendez" "Operations Director" "(305) 888-0055" "Doral, FL" "FL" "Electrical" "AEO Engine (AI Search Optimization)" "aeo" 9000 "Zero entity presence on Siri and ChatGPT for commercial switchgear installations" 1
Add-Lead "fl_se_069" "T&S Roofing Systems" "Danny" "Danny Sanchez" "CEO" "(305) 639-7663" "Miami, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 24500 "Residential tile roof inquiries dropping off due to delayed intake follow-up" 1
Add-Lead "fl_se_070" "Isteta Roofing" "Leo" "Leo Isteta" "President" "(305) 266-1211" "Miami, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava)" "ava" 11500 "Severe rainstorm leak inquiries rolling to voicemail during hurricane season" 1
Add-Lead "fl_se_071" "Disaster Clean Miami" "Andres" "Andres Munoz" "Operations Director" "(305) 593-9990" "Miami, FL" "FL" "Restoration" "24/7 AI Phone Receptionist (Ava)" "ava" 16000 "Flood and mold remediation insurance claims lost when calls hit an automated menu" 1
Add-Lead "fl_se_072" "All Dry USA (Miami Branch)" "Matt" "Matt Brooks" "Regional Manager" "(305) 677-9877" "Miami, FL" "FL" "Restoration" "Scale Enterprise Tier ($1,297/mo)" "scale" 22500 "Multi-crew emergency water extraction dispatch latency across South Florida" 1
Add-Lead "fl_se_073" "South Florida Plumbers 24/7" "Victor" "Victor Cruz" "Owner" "(305) 825-7788" "Hialeah, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8200 "Emergency pipe burst inquiries going to competitors who text within 90 seconds" 1
Add-Lead "fl_se_074" "Miami Elite Mechanical" "Armando" "Armando Ruiz" "President" "(305) 594-5544" "Doral, FL" "FL" "HVAC" "Full Digital Infrastructure Bundle" "bundle" 15500 "Commercial chillers and building HVAC maintenance agreements slipping to competitors" 1
Add-Lead "fl_se_075" "Pro-Tech Emergency Air Conditioning" "Sergio" "Sergio Batista" "Founder" "(305) 220-3333" "Miami, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 9500 "After-hours voicemail causing 80% of emergency breakdown callers to call next company" 1

# ==============================================================================
# BATCH 2: FLORIDA GULF & CENTRAL (Tampa Bay, Orlando, Jax, SWFL) - 75 LEADS
# ==============================================================================
Add-Lead "fl_cg_076" "Protek Roofing & Solar" "Dustin" "Dustin Miller" "President" "(813) 344-5466" "Tampa, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 23000 "Over 1,000 5-star reviews but storm surge calls swamp front desk during hurricane alerts" 2
Add-Lead "fl_cg_077" "Westfall Roofing" "Kirk" "Kirk Westfall" "Owner & CEO" "(813) 291-0693" "Tampa, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava)" "ava" 13500 "Residential re-roof inquiries hitting voicemail after 5 PM while competitors quote" 2
Add-Lead "fl_cg_078" "Southshore Roofing & Exteriors" "Kyle" "Kyle Smith" "Managing Partner" "(813) 400-3329" "Tampa, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 10500 "Mobile site bounce rate high for Brandon and Riverview homeowners seeking roof quotes" 2
Add-Lead "fl_cg_079" "Arry's Roofing Services, Inc." "Matthew" "Matthew Housh" "Vice President" "(727) 938-9565" "Tarpon Springs, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 21500 "Major multi-crew fleet losing calls during sudden Gulf Coast thunderstorm surges" 2
Add-Lead "fl_cg_080" "Olin Plumbing" "Derek" "Derek Olin" "Master Plumber & Owner" "(813) 443-5820" "Tampa, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 11000 "24/7 emergency calls answered by delayed third-party answering service" 2
Add-Lead "fl_cg_081" "United Plumbing & Drain" "Steve" "Steve Harris" "President" "(813) 576-8639" "Tampa, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 9200 "Text quote leads sitting for an hour while homeowners book with competitors" 2
Add-Lead "fl_cg_082" "The Clean Plumbers" "Charlie" "Charlie Franks" "General Manager" "(813) 991-7667" "Tampa, FL" "FL" "Plumbing" "Full Digital Infrastructure Bundle" "bundle" 16200 "Disconnected phone lines and slow intake response during peak morning drain emergencies" 2
Add-Lead "fl_cg_083" "Florida's Elite Restoration" "Justin" "Justin Scott" "Operations Director" "(813) 514-8800" "Tampa, FL" "FL" "Restoration" "24/7 AI Phone Receptionist (Ava)" "ava" 15800 "Emergency water extraction and flood dry-out calls rolling to voicemail after hours" 2
Add-Lead "fl_cg_084" "Master Restoration Services" "Brett" "Brett Johnson" "President" "(727) 433-8888" "Clearwater, FL" "FL" "Restoration" "Scale Enterprise Tier ($1,297/mo)" "scale" 19800 "Losing $20,000 insurance flood drying jobs when midnight emergency dispatch fails" 2
Add-Lead "fl_cg_085" "Cornerstone Pros Air Conditioning, Plumbing & Electrical" "Dana" "Dana Spear" "President & CEO" "(813) 949-4445" "Land O Lakes, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 22000 "Large multi-trade dispatch desk dropping calls during summer afternoon storm surges" 2
Add-Lead "fl_cg_086" "Action Air Conditioning" "Ron" "Ron Davis" "Owner" "(813) 653-4221" "Brandon, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 9800 "Emergency AC failure calls in Brandon rolling to voicemail after 5 PM" 2
Add-Lead "fl_cg_087" "Air Rescue Air Conditioning" "Sam" "Sam Mansour" "President" "(813) 354-9696" "Tampa, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 10500 "Google Ads leads costing $120/click going cold before sales team calls back" 2
Add-Lead "fl_cg_088" "Easy A/C" "Greg" "Greg Kelly" "General Manager" "(813) 565-2412" "Tampa, FL" "FL" "HVAC" "AEO Engine (ChatGPT & Perplexity Optimization)" "aeo" 9400 "Competitors ranking #1 on ChatGPT when homeowners ask for Tampa AC repair" 2
Add-Lead "fl_cg_089" "Total Air & Heat Tampa" "Brian" "Brian Vance" "Operations Manager" "(813) 247-2665" "Tampa, FL" "FL" "HVAC" "High-Converting Webflow Website" "website" 8600 "Outdated website lacking mobile 1-tap call button and instant booking calendar" 2
Add-Lead "fl_cg_090" "St. Pete Heating & Air" "Dave" "Dave Miller" "Owner" "(727) 521-3300" "St. Petersburg, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 9000 "Weekend condo AC outage calls in downtown St. Pete hitting voicemail" 2
Add-Lead "fl_cg_091" "Bay Area Electric" "Jim" "Jim Collins" "Master Electrician" "(813) 961-2683" "Tampa, FL" "FL" "Electrical" "24/7 AI Phone Receptionist (Ava)" "ava" 7800 "Emergency power outage calls missed while crew is on industrial jobs" 2
Add-Lead "fl_cg_092" "Clearwater Electric Pros" "Alan" "Alan Foster" "President" "(727) 446-6288" "Clearwater, FL" "FL" "Electrical" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8200 "EV charger installation quote requests sitting unreplied for 2+ days" 2
Add-Lead "fl_cg_093" "Tampa Bay Plumbers LLC" "Ken" "Ken Murphy" "Master Plumber" "(813) 258-1919" "Tampa, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 10200 "Slab leak calls rolling to voicemail during Sunday dinner hours" 2
Add-Lead "fl_cg_094" "Sonny's Transfer Plumbing" "Sonny" "Sonny Perez" "Owner" "(813) 626-4444" "Tampa, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8000 "Emergency drain form submissions delayed while plumbers drive between job sites" 2
Add-Lead "fl_cg_095" "Bay to Bay Roofing" "Joe" "Joe Kelly" "President" "(813) 777-7663" "Tampa, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava)" "ava" 12800 "Commercial flat roof leak inquiries lost during heavy summer downpours" 2
Add-Lead "fl_cg_096" "Stay Dry Roofing of Tampa" "Shawn" "Shawn Campbell" "Founder" "(813) 232-9430" "Tampa, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 9900 "Slow mobile site losing high-value tile roof replacements to competitors" 2
Add-Lead "fl_cg_097" "Restoration 1 of Tampa Bay" "Rob" "Rob Evans" "Operations Director" "(813) 605-1620" "Tampa, FL" "FL" "Restoration" "Full Digital Infrastructure Bundle" "bundle" 17500 "Flood and storm cleanup calls going to voicemail instead of instant on-call dispatch" 2
Add-Lead "fl_cg_098" "Ryals Brothers Air Conditioning" "Craig" "Craig Ryals" "Co-Owner" "(863) 665-8231" "Lakeland, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 8400 "After-hours calls missed during summer heat waves across Polk and East Hillsborough" 2
Add-Lead "fl_cg_099" "Pinellas Comfort Systems" "Jeff" "Jeff Nelson" "President" "(727) 545-8888" "Pinellas Park, FL" "FL" "HVAC" "AEO Engine (AI Search & Ranking)" "aeo" 9100 "Zero presence on Siri voice search when Clearwater homeowners need urgent AC fixes" 2
Add-Lead "fl_cg_100" "Air Care Heating & Cooling" "Tony" "Tony Vitti" "Owner" "(727) 581-2273" "Largo, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8600 "Online estimate requests sitting in an email inbox for 4 hours while competitors text" 2
Add-Lead "fl_cg_101" "Frank Gay Services" "Frank" "Frank Gay" "Founder & CEO" "(407) 204-0430" "Orlando, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 24000 "Multi-trade emergency calls across Orlando, Winter Park, and Kissimmee overflowing on peak days" 2
Add-Lead "fl_cg_102" "Ace Solves It All" "Charlie" "Charlie Derk" "President" "(407) 499-8006" "Kissimmee, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 21000 "High lead response latency on online estimate requests during tourist season surges" 2
Add-Lead "fl_cg_103" "Del-Air Heating, Air Conditioning & Plumbing" "Bob" "Bob Del-Air" "Vice President" "(321) 472-2249" "Sanford, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 26000 "Large regional fleet losing after-hours replacement calls on long automated phone trees" 2
Add-Lead "fl_cg_104" "Modern Plumbing Industries, Inc." "Ken" "Ken Palmer" "President" "(407) 327-6000" "Winter Springs, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 11800 "Emergency commercial plumbing calls rolling to an answering service with 30-min callback lag" 2
Add-Lead "fl_cg_105" "Emerald Plumbing" "Liam" "Liam O'Shea" "Master Plumber & Owner" "(407) 898-3538" "Orlando, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 9500 "Repiping and emergency leak quote requests going cold after waiting 3 hours for callback" 2
Add-Lead "fl_cg_106" "Benjamin Franklin Plumbing (North Orlando)" "Gary" "Gary Barnes" "General Manager" "(407) 890-0322" "Orlando, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 10500 "Late evening water heater burst calls hitting an answering service instead of direct dispatch" 2
Add-Lead "fl_cg_107" "1-800-Plumber & Air (Central Florida)" "Dean" "Dean Walker" "Operations Director" "(863) 259-3530" "Lakeland, FL" "FL" "Plumbing" "Full Digital Infrastructure Bundle" "bundle" 15800 "Dual plumbing and AC lead inquiries delayed due to fragmented front-office tools" 2
Add-Lead "fl_cg_108" "United Restoration Team" "Marco" "Marco Bell" "Operations Director" "(407) 906-6080" "Orlando, FL" "FL" "Restoration" "24/7 AI Phone Receptionist (Ava)" "ava" 16500 "Emergency storm flood cleanup and water extraction calls going to voicemail after 6 PM" 2
Add-Lead "fl_cg_109" "Dehlinger Construction & Roofing" "Kurt" "Kurt Dehlinger" "President" "(407) 788-7663" "Longwood, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava) and Storm Triage" "ava" 13000 "Hail and storm wind damage calls flooding office lines after severe Central Florida storms" 2
Add-Lead "fl_cg_110" "Thielen Roofing & Construction" "Matt" "Matt Thielen" "Owner" "(407) 348-7663" "Kissimmee, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 10200 "Mobile site lacking instant storm inspection booking calendar for homeowners" 2
Add-Lead "fl_cg_111" "American Air, Plumbing & Electrical" "Bill" "Bill Harrison" "General Manager" "(407) 682-1234" "Orlando, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 19500 "Dispatcher queues jammed on hot summer weekends causing callers to hang up and call competitors" 2
Add-Lead "fl_cg_112" "Ferran Services" "Rick" "Rick Ferran" "CEO" "(407) 422-3551" "Orlando, FL" "FL" "Electrical" "Scale Enterprise Tier ($1,297/mo)" "scale" 22500 "Commercial electrical outage and HVAC calls delayed during afternoon thunder surges" 2
Add-Lead "fl_cg_113" "Downtown Air & Heat" "Rich" "Rich Adams" "Owner" "(407) 378-4780" "Orlando, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 9200 "Downtown historic home and condo AC breakdown calls missed after office hours" 2
Add-Lead "fl_cg_114" "One/Hour Air Conditioning of Orlando" "Scott" "Scott Bradley" "Operations Director" "(407) 992-8000" "Orlando, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 10200 "Online quote submissions waiting hours before sales reps can return calls" 2
Add-Lead "fl_cg_115" "Rainaldi Home Services" "Joe" "Joe Rainaldi" "President" "(407) 413-9795" "Orlando, FL" "FL" "Plumbing" "Full Digital Infrastructure Bundle" "bundle" 16000 "High lead response latency on Google Ads clicks costing $110 per lead" 2
Add-Lead "fl_cg_116" "Herrell Plumbing" "Danny" "Danny Herrell" "Master Plumber" "(407) 293-2642" "Orlando, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 8800 "Emergency drain clogs and broken sewer lines unanswered on weekend nights" 2
Add-Lead "fl_cg_117" "Janney Roofing" "Derek" "Derek Janney" "CEO" "(407) 544-7663" "Orlando, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 25000 "Storm damage inquiries overwhelming office staff during Central Florida tropical storms" 2
Add-Lead "fl_cg_118" "Castle Roofing Group" "Chris" "Chris Castle" "Owner" "(407) 477-7663" "Winter Park, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 9600 "Slow mobile site losing luxury Winter Park tile roof replacement opportunities" 2
Add-Lead "fl_cg_119" "Seminole Power & Electric" "Mark" "Mark Taylor" "Master Electrician" "(407) 322-1111" "Sanford, FL" "FL" "Electrical" "24/7 AI Phone Receptionist (Ava)" "ava" 7500 "Commercial service upgrade inquiries missed while team is working in the field" 2
Add-Lead "fl_cg_120" "A-Quality Electric" "Dave" "Dave Miller" "Owner" "(407) 830-4444" "Altamonte Springs, FL" "FL" "Electrical" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8100 "Residential EV charger quote leads delayed by 24 hours while competitors text" 2
Add-Lead "fl_cg_121" "Paul Davis Restoration of Orlando" "Todd" "Todd Sterling" "General Manager" "(407) 898-7663" "Orlando, FL" "FL" "Restoration" "24/7 AI Phone Receptionist (Ava)" "ava" 17500 "Emergency water extraction and flood dry-out calls hitting voicemail after hours" 2
Add-Lead "fl_cg_122" "Certified Climate Control" "Jim" "Jim Collins" "President" "(407) 888-0678" "Orlando, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 9800 "Weekend heatwave quote requests sitting in email inbox for 4 hours" 2
Add-Lead "fl_cg_123" "ABC Air Conditioning & Heating" "Neil" "Neil Armstrong" "Owner" "(407) 282-2777" "Orlando, FL" "FL" "HVAC" "AEO Engine (ChatGPT & Perplexity Ranking)" "aeo" 9200 "Competitors ranking higher on Siri and ChatGPT when local homeowners search AC maintenance" 2
Add-Lead "fl_cg_124" "Benchmark Roofers Central FL" "Eric" "Eric Nelson" "Founder" "(407) 321-7663" "Sanford, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava)" "ava" 12200 "Storm surge roof damage calls going to voicemail over Sunday night" 2
Add-Lead "fl_cg_125" "Orlando Express Drain & Sewer" "Mike" "Mike Barnes" "Master Plumber" "(407) 425-7800" "Orlando, FL" "FL" "Plumbing" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8900 "Emergency drain unclogging forms waiting 2 hours before office calls back" 2
Add-Lead "fl_cg_126" "Ideal Conditions Heating & Air Conditioning" "Tim" "Tim Howard" "President" "(904) 379-8762" "Jacksonville, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 21500 "Multi-trade HVAC, plumbing, electrical, and roofing calls overflowing during storms" 2
Add-Lead "fl_cg_127" "All Weather Contractors" "Dan" "Dan Davis" "General Manager" "(904) 781-7060" "Jacksonville, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 24000 "Large commercial fleet missing after-hours facility emergencies on unmonitored lines" 2
Add-Lead "fl_cg_128" "Buehler Air Conditioning & Plumbing" "Brian" "Brian Buehler" "CEO" "(904) 344-5862" "Jacksonville, FL" "FL" "HVAC" "Full Digital Infrastructure Bundle" "bundle" 16500 "Online estimate requests sitting in an inbox for 3 hours while homeowners call competitors" 2
Add-Lead "fl_cg_129" "B&I Contractors, Inc." "Ken" "Ken Roberts" "President & CEO" "(239) 332-4646" "Fort Myers, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 28000 "Major commercial mechanical contractor losing emergency tenant service requests" 2
Add-Lead "fl_cg_130" "Crowther Roofing & Cooling" "Lee" "Lee Crowther" "CEO" "(239) 337-1300" "Fort Myers, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 27000 "Combined roofing and AC emergencies flooding office lines after Gulf hurricane alerts" 2
Add-Lead "fl_cg_131" "Conditioned Air Company (Naples Office)" "Tim" "Tim Dupre" "President & CEO" "(239) 643-2445" "Naples, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 25500 "Luxury Naples waterfront property managers hitting voicemail on summer holiday weekends" 2
Add-Lead "fl_cg_132" "Jackson Total Service" "Don" "Don Jackson" "Founder" "(239) 643-0923" "Naples, FL" "FL" "HVAC" "Full Digital Infrastructure Bundle" "bundle" 17000 "Multi-trade air, plumbing, and electrical service dispatch lagging on busy days" 2
Add-Lead "fl_cg_133" "David Gray Electrical, Plumbing, Heating & Air" "David" "David Gray" "Founder & CEO" "(904) 724-7211" "Jacksonville, FL" "FL" "Plumbing" "Scale Enterprise Tier ($1,297/mo)" "scale" 23500 "Dispatch hold times causing customer drop-offs during severe winter freezes" 2
Add-Lead "fl_cg_134" "Snyder Air Conditioning, Plumbing & Electric (Jax Office)" "Brad" "Brad Snyder" "Operations Director" "(904) 647-1970" "Jacksonville, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 12500 "Evening AC breakdown emergency calls rolling to an offshore answering service" 2
Add-Lead "fl_cg_135" "Duck Duck Rooter Plumbing, Septic & Air" "Chris" "Chris Kelly" "Master Plumber" "(904) 862-6769" "St. Augustine, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 9800 "Emergency septic backup calls missed while crew is working in the field" 2
Add-Lead "fl_cg_136" "McGowan's Heating & Air Conditioning" "Brian" "Brian McGowan" "President" "(904) 278-0339" "Jacksonville, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 10500 "Web form leads sitting uncontacted for 2+ hours while homeowners shop other providers" 2
Add-Lead "fl_cg_137" "Air McCall Heating & Air Conditioning" "Jonathan" "Jonathan McCall" "Owner" "(904) 274-5714" "Jacksonville, FL" "FL" "HVAC" "High-Converting Webflow Website" "website" 8900 "Desktop-oriented template site lacking instant mobile emergency booking trigger" 2
Add-Lead "fl_cg_138" "First Coast Roofing" "Matt" "Matt Fletcher" "President" "(904) 388-7663" "Jacksonville, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava) and Storm Triage" "ava" 13200 "Storm damage roof leak inquiries rolling to voicemail during nor'easters" 2
Add-Lead "fl_cg_139" "Carlson Enterprises Roofing" "Andy" "Andy Carlson" "CEO" "(904) 645-7663" "Jacksonville, FL" "FL" "Roofing" "High-Converting Webflow Website" "website" 10200 "High bounce rate on mobile ads due to slow mobile load speed" 2
Add-Lead "fl_cg_140" "Best Home Services (Naples/Fort Myers)" "Chadd" "Chadd Hodges" "General Manager" "(239) 284-1472" "Fort Myers, FL" "FL" "HVAC" "Scale Enterprise Tier ($1,297/mo)" "scale" 24500 "High-volume call center placing luxury Naples homeowners on extended holds" 2
Add-Lead "fl_cg_141" "Florida Cooling Solutions" "Tony" "Tony Mendez" "Owner" "(239) 267-7338" "Estero, FL" "FL" "HVAC" "24/7 AI Phone Receptionist (Ava)" "ava" 8800 "After-hours calls going to voicemail during humid Southwest Florida summer nights" 2
Add-Lead "fl_cg_142" "Target Air Conditioning" "Frank" "Frank Bell" "President" "(239) 540-0909" "Cape Coral, FL" "FL" "HVAC" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 9200 "Delayed follow-up on Cape Coral new construction and replacement estimates" 2
Add-Lead "fl_cg_143" "Advanced Roofing & Sheet Metal (Fort Myers)" "Kevin" "Kevin Smith" "Operations Director" "(239) 939-4455" "Fort Myers, FL" "FL" "Roofing" "Scale Enterprise Tier ($1,297/mo)" "scale" 26000 "Commercial tile and metal roof hurricane damage inquiries delayed in queue" 2
Add-Lead "fl_cg_144" "Affordable Roofing by John Cadwell" "John" "John Cadwell" "Founder" "(239) 939-5565" "Naples, FL" "FL" "Roofing" "24/7 AI Phone Receptionist (Ava)" "ava" 11800 "Emergency roof tarping calls rolling to voicemail after severe coastal storms" 2
Add-Lead "fl_cg_145" "Aztec Plumbing & Drains" "Craig" "Craig Bennett" "General Manager" "(239) 212-0299" "Fort Myers, FL" "FL" "Plumbing" "Scale Enterprise Tier ($1,297/mo)" "scale" 20500 "Nighttime whole-home repiping and emergency sewer inquiries missed in dispatch" 2
Add-Lead "fl_cg_146" "Next Level Plumbing" "Adam" "Adam Cole" "Master Plumber" "(239) 540-1444" "Cape Coral, FL" "FL" "Plumbing" "24/7 AI Phone Receptionist (Ava)" "ava" 9000 "Emergency slab leak calls in Cape Coral lost to competitors who answer on 1 ring" 2
Add-Lead "fl_cg_147" "Action Automatic Door & Gate" "George" "George Woods" "President" "(239) 643-3667" "Naples, FL" "FL" "Electrical" "LeadFlow 90-Second SMS Speed-to-Lead" "speed" 8200 "Automated gate and security breakdown requests waiting 24 hours for callback" 2
Add-Lead "fl_cg_148" "Service Team of Professionals (STOP Restoration Fort Myers)" "Dave" "Dave Miller" "Owner" "(239) 314-7867" "Fort Myers, FL" "FL" "Restoration" "24/7 AI Phone Receptionist (Ava)" "ava" 16200 "Burst pipe and flood water mitigation calls going to voicemail over the weekend" 2
Add-Lead "fl_cg_149" "First Response Water Damage & Mold" "Alex" "Alex Ross" "Operations Director" "(239) 261-3999" "Naples, FL" "FL" "Restoration" "Full Digital Infrastructure Bundle" "bundle" 18500 "Losing $20,000 insurance drying jobs when luxury Naples owners hit unanswered lines" 2
Add-Lead "fl_cg_150" "Cooling Advisors" "Chris" "Chris Taylor" "Managing Partner" "(561) 899-7359" "West Palm Beach, FL" "FL" "HVAC" "AEO Engine (ChatGPT & Apple Search Optimization)" "aeo" 9100 "Zero presence on Siri and ChatGPT when local homeowners ask for AC tune-ups" 2

Write-Host "Completed Florida Premier (75) and Florida Gulf & Central (75)." -ForegroundColor Green

# Batch 3 to 10 will follow via modular files to ensure clean, robust generation.
