Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Close all Edge
Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

function Take-Screenshot($url, $filename) {
    # Use InPrivate to avoid session restore
    Start-Process "msedge" "--inprivate $url"
    Start-Sleep -Seconds 6

    # Maximize the window
    $wshell = New-Object -ComObject wscript.shell
    $wshell.AppActivate('InPrivate')
    Start-Sleep -Milliseconds 500
    $wshell.SendKeys('{F11}')
    Start-Sleep -Seconds 2

    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("C:\workspaces\credit-loan-system\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output "Saved $filename"

    # Exit fullscreen and close
    $wshell.SendKeys('{F11}')
    Start-Sleep -Seconds 1
    Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Take-Screenshot "http://localhost:3001" "final_dashboard.png"
Take-Screenshot "http://localhost:3001/loans/apply" "final_apply.png"
Take-Screenshot "http://localhost:3001/loans/contracts" "final_contracts.png"
Take-Screenshot "http://localhost:3001/loans/contracts/1" "final_detail.png"

Write-Output "All done"
