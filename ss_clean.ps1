Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Take-Screenshot($url, $filename) {
    # Open URL in new window
    Start-Process "msedge" "--new-window $url"
    Start-Sleep -Seconds 5

    # Send F11 for fullscreen
    [System.Windows.Forms.SendKeys]::SendWait("{F11}")
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
    [System.Windows.Forms.SendKeys]::SendWait("{F11}")
    Start-Sleep -Seconds 1
}

Take-Screenshot "http://localhost:3001" "final_dashboard.png"
Take-Screenshot "http://localhost:3001/loans/apply" "final_apply.png"
Take-Screenshot "http://localhost:3001/loans/contracts" "final_contracts.png"
Take-Screenshot "http://localhost:3001/loans/contracts/1" "final_detail.png"

Write-Output "All done"
