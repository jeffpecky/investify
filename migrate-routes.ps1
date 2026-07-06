# Route Structure Migration Script
# Run this after stopping the dev server (Ctrl+C)

Write-Host "🔄 Starting route structure migration..." -ForegroundColor Cyan

# Step 1: Move routes from /user/ to root level
Write-Host "`n📁 Moving route directories..." -ForegroundColor Yellow

$routes = @(
    @{From="user/calculator"; To="calculator"},
    @{From="user/dashboard"; To="dashboard"},
    @{From="user/help"; To="help"},
    @{From="user/my-investments"; To="investments"},  # Renamed
    @{From="user/my-wallets"; To="wallets"},         # Renamed
    @{From="user/news"; To="news"},
    @{From="user/plans"; To="plans"},
    @{From="user/referrals"; To="referrals"},
    @{From="user/settings"; To="settings"},
    @{From="user/survey"; To="survey"},
    @{From="user/surveys"; To="surveys"},
    @{From="user/withdrawals"; To="withdrawals"}
)

foreach ($route in $routes) {
    $from = "src/routes/(app)/$($route.From)"
    $to = "src/routes/(app)/$($route.To)"
    
    if (Test-Path $from) {
        Write-Host "  Moving $($route.From) → $($route.To)" -ForegroundColor Green
        Move-Item -Path $from -Destination $to -Force
    } else {
        Write-Host "  ⚠️  $($route.From) not found" -ForegroundColor Yellow
    }
}

# Step 2: Replace (app)/+layout.svelte with user layout
Write-Host "`n📝 Updating layout files..." -ForegroundColor Yellow
$userLayout = "src/routes/(app)/user/+layout.svelte"
$appLayout = "src/routes/(app)/+layout.svelte"

if (Test-Path $userLayout) {
    Write-Host "  Replacing app layout with user layout (has sidebar)" -ForegroundColor Green
    Copy-Item -Path $userLayout -Destination $appLayout -Force
}

# Step 3: Remove empty user directory
Write-Host "`n🗑️  Cleaning up..." -ForegroundColor Yellow
$userDir = "src/routes/(app)/user"
if (Test-Path $userDir) {
    $remaining = Get-ChildItem -Path $userDir
    if ($remaining.Count -eq 0 -or ($remaining.Count -eq 1 -and $remaining[0].Name -eq "+layout.svelte")) {
        Write-Host "  Removing empty user directory" -ForegroundColor Green
        Remove-Item -Path $userDir -Recurse -Force
    } else {
        Write-Host "  ⚠️  User directory still has files:" -ForegroundColor Yellow
        $remaining | ForEach-Object { Write-Host "    - $($_.Name)" }
    }
}

Write-Host "`n✅ Migration complete!" -ForegroundColor Green
Write-Host "`n⚠️  IMPORTANT: Update navigation links and test all routes!" -ForegroundColor Yellow
