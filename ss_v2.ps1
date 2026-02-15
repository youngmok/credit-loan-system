Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Close all Edge windows first
Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

function Take-Screenshot($url, $filename) {
    Start-Process "msedge" $url
    Start-Sleep -Seconds 6

    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("C:\workspaces\credit-loan-system\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output "Saved $filename"
}

Take-Screenshot "http://localhost:3001" "final_dashboard.png"
Take-Screenshot "http://localhost:3001/loans/apply" "final_apply.png"
Take-Screenshot "http://localhost:3001/loans/contracts" "final_contracts.png"
Take-Screenshot "http://localhost:3001/loans/contracts/1" "final_detail.png"

Write-Output "All done"
