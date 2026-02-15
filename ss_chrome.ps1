Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Kill Chrome first
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

function Take-SS($url, $filename) {
    Start-Process "chrome" "--new-window --start-maximized $url"
    Start-Sleep -Seconds 6

    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("C:\workspaces\credit-loan-system\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output "Saved $filename"

    Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Take-SS "http://localhost:3001" "final_dashboard.png"
Take-SS "http://localhost:3001/loans/contracts/1" "final_detail.png"

Write-Output "All done"
