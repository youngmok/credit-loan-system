Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Send F11 to maximize browser
[System.Windows.Forms.SendKeys]::SendWait("{F11}")
Start-Sleep -Seconds 3

$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap.Save('C:\workspaces\credit-loan-system\screenshot3.png')
$graphics.Dispose()
$bitmap.Dispose()
Write-Output 'Screenshot saved'
