Add-Type -AssemblyName System.Drawing

$width = 1584
$height = 396

$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background dark gradient
$bgRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.Color]::FromArgb(255, 11, 15, 22), [System.Drawing.Color]::FromArgb(255, 6, 8, 12), [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
$g.FillRectangle($bgBrush, $bgRect)

# Ambient glow on right
$glowRect = New-Object System.Drawing.Rectangle(900, -50, 700, 500)
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse($glowRect)
$pGlow = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
$pGlow.CenterColor = [System.Drawing.Color]::FromArgb(45, 245, 158, 11)
$pGlow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 11, 15, 22))
$g.FillPath($pGlow, $path)

# Subtle secondary cyan/blue glow
$path2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$path2.AddEllipse(1200, 150, 450, 300)
$pGlow2 = New-Object System.Drawing.Drawing2D.PathGradientBrush($path2)
$pGlow2.CenterColor = [System.Drawing.Color]::FromArgb(25, 56, 189, 248)
$pGlow2.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 11, 15, 22))
$g.FillPath($pGlow2, $path2)

# Grid lines on left/bottom
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(18, 255, 255, 255), 1)
for ($x = 40; $x -lt $width; $x += 60) {
  $g.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 40; $y -lt $height; $y += 60) {
  $g.DrawLine($gridPen, 0, $y, $width, $y)
}

# Left subtle ambient tech accent (leaves safe area for Luke's profile photo)
$accentPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 245, 158, 11), [float]1)
$g.DrawEllipse($accentPen, 50, 80, 280, 280)
$accentPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 245, 158, 11), [float]1)
$g.DrawEllipse($accentPen2, 90, 120, 200, 200)

# Content starts around X = 430 (safe from profile photo overlap)
$startX = 430

# 1. Eyebrow Tag
$eyebrowFont = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Bold)
$tagRect = New-Object System.Drawing.Rectangle($startX, 42, 380, 30)
$tagFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 245, 158, 11))
$tagBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 245, 158, 11), 1)
$g.FillRectangle($tagFill, $tagRect)
$g.DrawRectangle($tagBorder, $tagRect)
$tagTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
$g.DrawString("⚡ DONE-FOR-YOU CONTRACTOR SYSTEMS", $eyebrowFont, $tagTextBrush, $startX + 12, 47)

# 2. Main Title: VantorX Solutions
$titleFont = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold)
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 247, 250))
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
$dimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 160, 174, 192))

$g.DrawString("Vantor", $titleFont, $whiteBrush, $startX, 84)
$vantorWidth = $g.MeasureString("Vantor", $titleFont).Width
$g.DrawString("X", $titleFont, $goldBrush, $startX + $vantorWidth - 14, 84)
$xWidth = $g.MeasureString("X", $titleFont).Width
$g.DrawString(" Solutions", $titleFont, $whiteBrush, $startX + $vantorWidth + $xWidth - 26, 84)

# 3. Subtitle / Value Proposition
$subFont = New-Object System.Drawing.Font('Segoe UI', 16, [System.Drawing.FontStyle]::Regular)
$subText = "We build your website. We answer your phones. We run your follow-up."
$g.DrawString($subText, $subFont, $dimBrush, $startX + 2, 160)

# 4. Feature Badges (Pills)
$pillFont = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Bold)
$pills = @(
  "24/7 AI Receptionist (Ava)",
  "High-Converting Websites",
  "90s Speed-to-Lead SMS"
)

$pillX = $startX
$pillY = 212
$pillFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 24, 38))
$pillBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 245, 158, 11), [float]1)
$pillTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 235, 245))

foreach ($p in $pills) {
  $pSize = $g.MeasureString($p, $pillFont)
  $pRect = New-Object System.Drawing.Rectangle($pillX, $pillY, [int]($pSize.Width + 24), 36)
  $g.FillRectangle($pillFill, $pRect)
  $g.DrawRectangle($pillBorder, $pRect)
  $g.DrawString($p, $pillFont, $pillTextBrush, [float]($pillX + 12), [float]($pillY + 7))
  $pillX += [int]($pSize.Width + 34)
}

# 5. Bottom Demo & Authority Line
$bottomPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(35, 255, 255, 255), [float]1)
$g.DrawLine($bottomPen, $startX, 280, 1500, 280)

$footerFont = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
$ctaGoldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
$ctaDimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 160, 174, 192))

$g.DrawString("Live 24/7 AI Demo: (561) 813-8602", $footerFont, $ctaGoldBrush, [float]$startX, [float]302)
$g.DrawString("  |   vantorxsolutions.com   |   Verified Google Business", $footerFont, $ctaDimBrush, [float]($startX + 325), [float]302)

# Save to destination paths
$outDir = "C:\Users\hungr\.gemini\antigravity\brain\b805e771-e1c1-4976-afc1-cd59dd49eae0"
$websiteAssetsDir = "C:\Users\hungr\.gemini\antigravity\scratch\Vantorxsolutions\website"

$dest1 = Join-Path $outDir "linkedin_banner_vantorx.png"
$dest2 = Join-Path $websiteAssetsDir "linkedin_banner_vantorx.png"

$bmp.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

Write-Host "LinkedIn Banner successfully rendered at: $dest1"
Write-Host "Website Banner asset at: $dest2"
